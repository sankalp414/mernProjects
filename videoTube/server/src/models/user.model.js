import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    fullname:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        index:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    refreshToken:{
        type:String
    }
},{timestamps:true})



export const User = mongoose.model("User",userSchema)