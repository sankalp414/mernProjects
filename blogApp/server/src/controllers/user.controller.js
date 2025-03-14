import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body
    if([username,email,password].some((fields)=> fields.trim === "")){
        throw new apiError(500,"All fields are required")
    }
    
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new apiError(
            
        )
    }
}) 

export{
    registerUser
}
