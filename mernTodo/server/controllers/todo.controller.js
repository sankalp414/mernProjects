import { Todo } from "../models/todo.model";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const createTodo = asyncHandler(async(req,res)=>{
    const {title,description} = req.body

    if(!(title || description)){
        throw new apiError(400,"All fields are required")
    }

    const todo = await Todo.create({
        title,
        description
    })
    if(!todo){
        throw new apiError(401,"Todo is not created successfully")
    }
    return res
    .status(201)
    .json(new apiResponse(200,todo,"Todo created successfully"))

})

export{
    createTodo
}