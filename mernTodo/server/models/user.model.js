import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
    }
},{timestamps:true})


userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) next()
    
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPassowrdCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id:this._id,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        })
}

userSchema.methods.generateRefreshToken = function() {
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