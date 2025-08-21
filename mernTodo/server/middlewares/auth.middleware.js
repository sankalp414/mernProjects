import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"



export const verifyJWT = asyncHandler(async(req,_,next)=>{
try {
    
        const token = req.cookies.accessToken || req.header("authorisation").replace("Bearer ","")
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(!decodedToken){
            throw new apiError(400,"Invalid token")
        } 
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    
        if(!user){
            throw new apiError(400,"Invalid access token")
        }
        req.user = user
        next()
} catch (error) {
    throw new apiError(400,"Unauthorised request")
}

})

