import mongoose, { Schema } from "mongoose"
import {bcrypt} from "bcryptjs"
import jwt from "jsonwebtoken"


const userSchema = new Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        index:true,
    },
    userName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        index:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true
    },
    avatarImg:{
        type:String,
        required:true
    },
    coverImg:{
        type:String,
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})


userSchema.pre("save", async function(next){
    if(!isModified(this.password)) next()
    this.password = await bcrypt.hash(this.password,10) 
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(this.password,password)
}


userSchema.methods.generateAccessToken = function(){
    return  jwt.sign(
        {
            _id:this._id,
            fullName:this.fullName,
            userName:this.userName,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}


userSchema.methods.generateRefreshToken =  function(){
    return jwt.sign(
        {
            _id:this._id
        },
            process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        })
}



export const User = mongoose.model("User",userSchema)