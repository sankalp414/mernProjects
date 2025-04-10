import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new apiError(500,"Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body

    if([username,email,password].some((fields)=> fields?.trim() === "")){
        throw new apiError(400,"All fields are required")
    }
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new apiError(409,"User with email already exist")
    }

    const user = User.create({
        username:username.toLowerCase(),
        email,
        password
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new apiError(500,"Something went wrong while registering the user")
    }

    return res
    .status(200)
    .json(new apiResponse(200,createdUser,"User created successfully"))
})

const loginUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body

    if(!username && !email){
        throw new apiError(400,"Username or email is required")
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new apiError(404,"User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(401,"Invalid user credentials")
    }
    const {accessToken,refreshToken} = await user.generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookies("accessToken",accessToken,options)
    .cookies("refreshToken",refreshToken,options)
    .json(new apiResponse(200,
        {
            user:loggedInUser,
            accessToken,
            refreshToken
        },
        "User successfully loggedIn"
    ))

})

const loggedOut = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {refreshToken,}
        },
        {new:true}
    )
    const options = {
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(200,{},"User logged out"))
})
const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401,"Unauthorised request")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new apiError(401,"Invalid refresh token")
        }
        if(incomingRefreshToken != user?.refreshToken){
            throw new apiError(401,"Refresh token is expired or used")
        }
        const options={
            httpOnly:true,
            secure:true
        }
        
        const {accessToken,newRefreshToken} = generateAccessAndRefreshToken(user._id)

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(new apiResponse(20,{accessToken,refreshToken:newRefreshToken},"Access Token refreshed"))

    } catch (error) {
        throw new apiError(401,error.message || "Invalid refresh Token")
    }

})


export{
    registerUser,
    loginUser,
    loggedOut,
    refreshAccessToken
}