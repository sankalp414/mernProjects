import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

userSchema.pre("save", async function(next){
    if(this.isModified("password")) next()
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchemq.methods.isPasswordCorrect = async function(password){
    return bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email

    },
        process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
            process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:PROCESS.ENV.REFRESH_TOKEN_EXPIRY
        })
}

export const User = mongoose.model("User",userSchema)