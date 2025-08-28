import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploasdOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken  = await User.generateAccessToken()
        const refreshToken = await User.generateRefreshToken()

        user.refreshToken = refreshToken

        return {accessToken,refreshToken}

    } catch (error) {
        throw new apiError(500,"Something went wring while generating tokens")
    }
}


const registerUser = asyncHandler(async(req,res)=>{

    const {fullName,userName,email,password} = req.body

    if([fullName,userName,email,password].some((fields)=> fields.trim() === "")){
        throw new  apiError(400,"All fields are required")
    }
    const existedUser = await User.findOne({
        $or:[
            {email},{userName}
        ]
    })
    if(existedUser){
        throw new apiError(400,"User already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path

    let coverImageLocalPath
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage > 0){
        coverImageLocalPath = req.coverImg[0].path
    }
    if(!avatarLocalPath){
        throw new apiError(400,"Avatar image doesnot exists")
    }

    const  avatarImage = await uploasdOnCloudinary(avatarLocalPath)
    const coverImage = await uploasdOnCloudinary(coverImageLocalPath)

    if(!avatarImage){
        throw new apiError(400,"Avatar file is required")
    }

    const user = await User.create({
        fullName,
        userName: userName.toLowercase(),
        avatar:avatar.url,
        coverImage: coverImage.url || "",
        email,
        password
    })
    const createdUser = await User.fincById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new apiError(400,"Something went wrong while registering the user")
    }

    return res
    .status(201)
    .json(new apiResponse(200,createdUser,"User created successfully"))

})

const loginUser = asyncHandler(async(req,res)=>{

    const {email,userName,password} = req.body

    if(!(email || userName)){
        throw new apiError(400,"All fields are required")
    }
    const user = await User.findOne({
        $or:[{email},{userName}]
    })
    
    if(!user){
        throw new apiError(404,"User does not exist")
    }
    const isPasswordCorrect = await User.isPasswordValid(password)

    if(!isPasswordCorrect){
        throw new apiError(400,"Passowrd is not correct")
    }

    const {accessToken,refreshToken} = generateAccessAndRefreshToken(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -accessToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            {
                user:accessToken,loggedInUser,refreshToken
            },
            "User loggedin successfully"))


})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refrshToken:1
            }
        },
        {new:true}
    )

    const options={
        httpOnly:true,
        secure:true
    }

    res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(200,{},"User loggedOut successfully"))

})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incommingRefreshToken){
        throw new apiError(400,"Refresh token is expired or might be used")
    }
    try {
        
        const decodedToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken._id)

        if(!user){
            throw new apiError(400,"Invalid refresh token")
        }
        
        if(!incommingRefreshToken !== user?.refreshToken){
            throw new apiError(400,"refresh Token is expired or used")
        }

        const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly:true,
            secure:true
        }

        res
        .status(200)
        .cookies("accessToken",accessToken,options)
        .cookies("refreshToken",newRefreshToken,options)
        .json(
            new apiResponse(
                200,
                {
                    accessToken,
                    refreshToken:newRefreshToken
                },
                "Token regenerated successfully"
            ))

    } catch (error) {
        throw new apiError(400,"unauthorized request")
    }

})


export{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}

