import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import {jwt} from "jsonwebtoken"



const verifyJWT = asyncHandler(async(req,_,next)=>{
    const token = req.cookies.ACCESS_TOKEN || req.headers("AUTHORIZATION").replace("Bearer ","")

    if(!token){
        throw new apiError(401,"Unauthorized request")
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    if(!decodedToken){
        throw new apiError(401,"Invalid access token")
    }

})