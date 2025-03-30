import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshToken = async function (userId) {

    const user = await User.findById(userId)
    const accessToken = await User.generateAccessToken()
    const refreshToken = await User.generateRefreshToken()

    await user.save({validateBeforeSave:false})

    user.refreshToken = refreshToken

    return accessToken,refreshToken
}

const registerUser = asyncHandler(async(req,res)=>{

    const {username,email,password} = req.body

    if([username,email,password].some((fields)=> fields?.trim() == "")){
        throw new apiError(400,"All fields are required")
    }
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new apiError(400,"User already exists")
    }

    const user = await User.create({
        username:username.lowercase(),
        email,
        password
    })
    const createdUser = await User.findById(user._id).select("-password refreshToken")

    return res
    .status(201)
    .json(new apiResponse(200,createdUser,"User created successfully"))

})

const loginUser = asyncHandler(async(req,res)=>{

    const {username,email,password} = req.body

    if(!(email && password)){
        throw new apiError(400,"All fields are required")
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new apiError(409,"User does not exist")
    }
    const isPasswordValid = await User.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(409,"Password is not valid")
    }
    const {accessToken,refreshToken} = generateAccessAndRefreshToken(user._id)

    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "user loggedIn suuccessfully"
        ))
})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1,
            }
        },
        {
            new:true,
        }
    )
    const options= {
        httpOnly:true,
        secure:true
    }
    res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("accessToken",options)
    .json(new apiResponse(200,{},"User loggedOut successfully"))

})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const token = req.cooKies?.refreshToken || req.body.refreshToken

    if(!token){
        throw new apiError(400,"Unautharised request")
    }
    try {
        const decodedToken = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new apiError(401,"Invalid refresh Token")
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new apiError(401,"Refresh Token expired or used") 
        }
        const options={
            httpOnly:true,
            secure:true,
        }

        const {accessToken,newRefreshToken} = generateAccessAndRefreshToken(user._id)
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new apiResponse(
                200,
                {
                    accessToken,
                    refreshToken:newRefreshToken
                },
                "Access token refreshed suceesfully"
            ))
    } catch (error) {
        throw new apiError(401,"Invalid refresh token")
    }

})

export{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}