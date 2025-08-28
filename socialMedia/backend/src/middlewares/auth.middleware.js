import { User } from "../models/user.model"
import { apiError } from "../utils/apiError"
import jwt from "jsonwebtoken"


export const verifyJWT = async()=>{
    try {
        const incommingRefreshToken = req.cookies?.refreshToken || req.headers("Authorization").replace("Bearer","")

        if(!incommingRefreshToken){
            throw new apiError(400,"invalid refresh token")
        }
        const decodedToken = jwt.verify(incommingRefreshToken,process.env) 

    } catch (error) {
        throw new apiError(400,"Invalid refresh token")
    }
}