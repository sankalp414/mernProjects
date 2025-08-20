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

const updateTodo = asyncHandler(async(req,res)=>{
    const {todoId} = req.params
    const {title,description} = req.body

    const todo = await Todo.findByIdAndUpdate({
        todoId,
        $set:{
            title,
            description
        },
        
    },
    {new:true}
)
    return res
    .status(200)
    .json(new apiResponse(200,todo,"Todo updated successfully"))
})

const deleteTodo = asyncHandler(async(req,res)=>{
    const {todoId} = req.params
    const {title,description} = req.body

    const todo = await Todo.findByIdAndDelete({
        todoId,
        $unset:{
            title,
            content
        }
    },{new:true})
    
    return res.status(200).json(new apiResponse(200,{},"Todo deleted successfully"))
})




export{
    createTodo,
    updateTodo,
    deleteTodo
}