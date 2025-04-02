import { User } from "../models/user.model";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOncloudinary } from "../utils/cloudinary";

const generateAccessAndRefreshToken = async (userId)=>{
    const user = await User.findById(userId)
    const accessToken = await User.generateAccessToken(user)
    const refreshToken = await User.generateRefreshToken(user)

    user.refreshToken = refreshToken

    return {accessToken,refreshToken}
}

const registerUser = asyncHandler(async(req,res)=>{

    const {username,email,password}= req.body

    if([username,email,password].some((fields)=> fields.trim == "")){
        throw new apiError(400,"All fields are required")
    }
    const existeduser = await User.findOne({
        $or:[{email},{username}]
    })
    if(existeduser){
        throw new apiError(409,"User already exist")
    }
    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath
    if(req.files && Array.isArray(req.fiels.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new apiError(400,"Avatar file is required")
    }
    const avatar = await uploadOncloudinary(avatarLocalPath)
    const coverImage = await uploadOncloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiError(400,"Avatar file is required")
    }
    const user = await User.create({
        username,
        email,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",

    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new apiError(400,"User not created successfully")
    }
    return res
    .status(201)
    .json(new apiResponse(200,createdUser,"User created successfully"))

})
const loginUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body

    if(!username && !email){
        throw new apiError(409,"All fields are required")
    }

    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new apiError(404,"User does not exist")
    }

    const isPasswordValid = await User.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(409,"Password that you have entered is invalid")
    }

    const {accessToken,refreshToken} = generateAccessAndRefreshToken(existeduser._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpsOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookies("accessToken",accessToken,options)
    .cookies("refreshToken",refreshToken,options)
    .json(new apiResponse(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "User logged in successfully"))

})
const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndDelete(
        req.user._id,
        {
            $unset:{
            refreshToken:1
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
    return res
    .status(200)
    .clearCookie("AccessToken",options)
    .clearCookie("RefreshToken",options)
    .json(new apiResponse(200,{},"User logout successfully"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const token = req.cookies.refreshToken || req.body.refreshToken

    if(!token){
        throw new apiError(401,"Unauthorised request")
    }
    try {
        const decodedToken = await jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new apiError(401,"Invalid refresh token")
        }
        if(token !== user?.refreshToken){
            throw new apiError(400,"Refresh token expired or used")
        }
        const options ={
            httpOnly:true,
            secure:true
        }
        const {accessToken,newRefreshToken} = generateAccessAndRefreshToken(user._id)
        return res
        .status(200)
        .cookies("AccessToken",accessToken,options)
        .cookies("RefreshToken",newRefreshToken,options)
        .json(
            new apiResponse(
                200,
                accessToken,
                {
                    refreshToken:newRefreshToken
                },
                "Access token refreshed successfully"
            ))
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token")
    }
})








export{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}