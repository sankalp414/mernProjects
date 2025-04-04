import { User } from "../models/user.model";
import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import {jwt} from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try {
        const token = req.cookies.ACCESS_TOKEN || req.headers("AUTHORIZATION").replace("Bearer ","")
    
        if(!token){
            throw new apiError(401,"Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password refreshToken")
        if(!user){
            throw new apiError(400,"Invalid access token")
        }
        req.user = user
        next()
    } catch (error) {
        throw new apiError(401, error.message || "Invalid access token")
    }
})