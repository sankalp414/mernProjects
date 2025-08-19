import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessandRefreshToken = async (userId) => {
   try {
     const user = await User.findById(userId)
     const accessToken = User.generateAccessToken()
     const refreshToken = User.generateRefreshToken()
 
     user.refreshToken = refreshToken
 
     return {accessToken,refreshToken}
   } catch (error) {
    throw new apiError(500,"Unable to generate access and refresh token")
   }
}

const registerUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    if(!(email || password)){
        throw new apiError(400,"All fields are required")
    }
    const existedUser = await User.findOne({email})
    if(existedUser){
        throw new apiError(400,"User already exists")
    }
    const user = await User.create({
        email,
        password,
    })
    const createdUser = await User.findById(user._id).select('-password -refreshToken')

    return res
    .send(201)
    .json(201,createdUser,"User created Successfully")
    
})


const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    if(!(email && password)){
        throw new apiError(400,"All fields are required")
    }
    const user = await User.findOne({email})
    if(!user){
        throw new apiError(400,"User does not exists")
    }
    const {accessToken,refreshToken} = generateAccessandRefreshToken(user._id)

    const loggedInUser = user.findById(user._id).select("-password -refreshToken")
    
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookies("accessToken",accessToken,options)
    .cookies("refreshToken",refreshToken,options)
    .json(apiResponse(200,loggedInUser,"User loggedIn successfully"))
})
const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {new:true}
    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(200,{},"User logged out successfully"))

})
export{
    registerUser,
    loginUser,
    logoutUser
}


