import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {User} from "../models/user.models.js"
import {uploadCloudinary} from "../utils/cloudinary.js"

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = generateAccessToken()
        const refreshToken = generateRefreshToken()
    } catch (error) {
        throw new apiError(500,"Something went wrong while generating access and refresh token")
    }
}

const RegisterUser = asyncHandler(async(req,res)=>{
    //take all the fields from the req.body
    //see if there is any field is empty or not
    //then see if the user already exist or not
    //check the avatar 
    //create the user
    //remove the refresh and passoword
    //check the user created 
    //return the user
    const{username,email,password} = req.body
    if([username,email,password].some((field)=> field.trim === "")){
        throw new apiError(400,"Allfields are required")
    }
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new apiError(409,"User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path

    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new apiError(400,"avatar is required")
    }

    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiError(400,"avatar is required")
    }

    const user = User.create({
        username:username.toLowerCase(),
        email,
        password,
        avatar:avatar.url,
        coverImage: coverImage?.url || ""
    })

    const createdUser = await User.findById(user._id).select("-password -refreshtoken")

    if(!createdUser){
        throw new apiError(500,"Something went wrong wjile registerig the user")
    }
    return res.status(201).json(
        new apiResponse(200,"User created successfully")
    )


})
const loginUser = asyncHandler(async(req,res)=>{
    //take te input fields from the user
    //check is there any field that is left empty
    //then check the user exist or not if the user does not exist throw error
    //if the user exist then check the passowrd is the password correct
    //then generate refrech and access token for the user 
    //tehn creathe user object
    //and return the response

    const {username,email,password} = req.body
    if(!username || !email){
        throw new apiError("username or email is required")
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new apiError(404,"User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new apiError(401,"Invalid user user credentials")
    }
    
    const {accessToken,refrehToken} = generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options ={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User loggedIn successfully")
    )

})
const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id)
})

export{
    RegisterUser,
    loginUser
}