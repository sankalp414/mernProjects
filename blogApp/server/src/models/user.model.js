import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
    },
    coverImage:{
        type:String
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

export const User = mongoose.model("User",userSchema)