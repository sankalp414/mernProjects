import { User } from "../models/user.model";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";


const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return{refreshToken,accessToken}

    } catch (error) {
        throw new apiError(500,"Something went wrong while registering refresh and access token")
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    const {fullname,username,email,password}= req.body

    if([fullname,username,email,password].some((fields)=> fields?.trim() === "")){
        throw new apiError(400,"all fields are required")
    }
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new apiError(409,"User with username and email already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path

    let coverImageLocalPath ;
    if(req.files && Array.isArray(req.files.coverIamge) && req.files.coverIamge.length >0){
        coverImageLocalPath = req.files.coverIamge[0].path
    }
    if(!avatarLocalPath){
        throw new apiError(400,"Avatar file is required")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new apiError(500,"Something went wrog while registering the user")
    }
    return res.status(201).json(
        new apiResponse(200,createdUser,"User registered successfully")
    )
})

const loginUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body
    if(!username || !email){
        throw new apiError(400,"username or email kis required")
    }

    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new apiError(404,"User does not exists")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(401,"Invalid user credentials")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }
    
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User loggedIn successfully"
        )
    )

})
const logoutUser = asyncHandler(async(req,res)=>{
    

})
export{
    registerUser,
    loginUser,
    logoutUser
}