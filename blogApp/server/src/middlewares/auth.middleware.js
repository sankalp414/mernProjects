import { User } from "../models/user.model";
import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"

export const verifyJwt = asyncHandler(async(req,_,next)=>{
    try {
        const token = req.cookies.accessToken || req.header("authorization")?.replace("Bearer","")
        if(!token){
            throw new apiError(401,"Un authorised request")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new apiError(401,"Invalid access token")
        }
        req.user = user
        next()
    } catch (error) {
        throw new apiError(400,"Invalid refresh token")
    }
})