import { Todo } from "../models/todo.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTodo = asyncHandler(async(req,res)=>{
    const {title , content } = req.body
    const todo = Todo.create({
        title,content
    })
    res
    .status(201).
    json(new apiResponse(201,todo,"TODO created successfully"))

})
const getTodoById = asyncHandler(async(req,res)=>{
        const todoId = req.params
        const todo = await Todo.findById(todoId)
        if(!todo){
            throw new  apiError(401,"Todo is not here")
        }
        res.status(200).json(new apiResponse(200,todo,"Get todo by Id"))
})

export{
    createTodo,
    getTodoById
}

