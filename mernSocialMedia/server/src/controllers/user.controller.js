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

export{
    registerUser,
    loginUser
}