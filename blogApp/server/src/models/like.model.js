import mongoose, { Schema } from "mongoose"

const likeSchema = new Schema({
    blogId:{
        type:Schema.Types.ObjectId,
        ref:"Blog"
    },
    commentId:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    },
    auther:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Like = mongoose.model("Like",likeSchema)