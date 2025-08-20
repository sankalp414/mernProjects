import mongoose, { Schema } from "mongoose"

const comment = new Schema({
    constent:{
        type:String,
        required:true
    },
    blogId:{
        type:Schema.Types.ObjectId,
        ref:"Blog"
    },
    auther:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Comment = mongoose.model("Comment",comment)