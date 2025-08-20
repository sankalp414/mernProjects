import mongoose, { Schema } from "mongoose"

const blogSchema = new Schema({
    title:{
        type:String,
        required:true,
        index:true
    },
    content:{
        type:String,
        required:true
    },
    blogImage:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Blog = mongoose.model("Blog",blogSchema)

