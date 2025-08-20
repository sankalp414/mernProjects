import { Blog } from "../models/blog.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async(req,res)=>{
    const {title,content}  = req.body
    if(!title && !content){
        throw new apiError(400,"All fields are required")
    }
    const blogImageLocalPath = req.files?.blogImage[0]?.path
    
    if(!blogImageLocalPath){
        throw new apiError(400,"blogImage is required")
    }

    const blogImage = await uploadOnCloudinary(blogImageLocalPath)

    const createdBlog = await Blog.create({
        title,
        content,
        blogImage
    })

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                createdBlog,
                "Blog created successfully"
            )
        )

    
})

const updateBlog = asyncHandler(async(req,res)=>{
        const {blogId} = req.params
        const {title,content}=req.body
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $set:{
                    title,
                    content
                }
            },
            {new:true}
        )
        return res
        .status(200)
        .json(new apiResponse(200,blog,"Blog updated successfully"))
        
})

const deleteBlog = asyncHandler(async(req,res)=>{
    const {blogId} = req.params
    const {title,content,blogImage} = req.body

    const blog = await Blog.findByIdAndDelete({
        blogId,
        $unset:{
            title:1,
            content:1,
        }
    })
})


export {
    createBlog,
    updateBlog,
    deleteBlog
}