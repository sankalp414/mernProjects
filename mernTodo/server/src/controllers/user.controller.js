import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {User} from "../models/user.models.js"
import {uploadCloudinary} from "../utils/cloudinary.js"

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


export{
    RegisterUser
}