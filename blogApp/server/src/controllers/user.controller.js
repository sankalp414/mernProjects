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

        return {accessToken,refreshToken}

    } catch (error) {
        throw new apiError(400,message.error || "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body
    if([username,email,password].some((fields)=> fields.trim === "")){
        throw new apiError(500,"All fields are required")
    }
    
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new apiError(401,"User already existed")
    }
    const user = await User.create({
        username,
        email,
        password
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new apiError(400,"Somthing went wrong while registering the user")
    }
    return res.status(200).json(new apiResponse(201,createdUser,"user created successfully"))
}) 
const loginUser = asyncHandler(async(req,res)=>{
    const {username,password,email} = req.body

    if(!username && !email){
        throw new apiError(400,"All fields are required")
    }
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(!existedUser){
        throw new apiError(404,"User with this email or password does not exist")
    }
    const validatePassword = await User.isPasswordCorrect(password,this.password)

    if(!validatePassword){
        throw new apiError(409,"The password is not correct")
    }

    const {accessToken,refreshToken} = generateAccessAndRefreshToken(existedUser._id)

    const loggedInUser = await User.findById(existedUser._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    res.status(200)
    .cookies("accessToken",accessToken,options)
    .cookies("refreshToken",refreshToken,options)
    .json(new apiResponse(200,{
        user: loggedInUser,accessToken,refreshToken
    },"User loggedIn successfully"))


})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new:true
        }
    )
    const options ={
        httpOnly:true,
        secure:true
    }
    res
    .status(200)
    .clearCookie("accessToken",accessToken,options)
    .clearCookie("refreshToken",refreshToken,options)
    .json(new apiResponse(202,{},"User loggedout successfully"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.RefreshToken || req.body.RefreshToken
    if(!incomingRefreshToken){
        throw new apiError(401,"Unauthorised request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new apiError(401,"Invalid refreshToken")
        }
        if(incomingRefreshToken !== user.refreshToken){
            throw new apiError(401,"Refresh token is used or it is expired")
        }
        const options={
            httpOnly:true,
            secure:true
        }
        const {accessToken,newRefreshToken}= generateAccessAndRefreshToken(user._id)

        return res
        .status(200)
        .cookies("accessToken",accessToken,options)
        .cookies("refreshToken",newRefreshToken,options)
        .json(new apiResponse(
            200,
            {
                accessToken,
                refreshToken:newRefreshToken
            },
            "Access token refreshed"
        ))
    } catch (error) {
        throw new apiError(401,"Invalid refresh Token")
    }
})

export{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
