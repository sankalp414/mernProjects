import { Todo } from "../models/todo.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

const getAllTodo = asyncHandler(async(req,res)=>{
    const {query,complete} = req.query

    const todos = await Todo.aggregate([
        {
            $match:
                query?.length >0    ?
                {
                    title:{
                        $regex:query.trim(),
                        $options: "i"
                    }
                }            
            :{}
        },
        {
            $match: complete
            ? {
                isComplete: JSON.parse(complete)
            }:{}
        },
        {
            updatedAt: -1
        }
    ])
    return res
    .status(200)
    .json(new apiResponse(200,todos,"All todos fetched successfully"))
})


const toggleTodoStatusDone = asyncHandler(async (req,res) => {

    const {todoId} = req.params
    const todo = await Todo.findById(todoId)
    if(!todo){
        new apiError(400,"Todo does not exist")
    }

    todo.isComplete = !todo.isComplete

    await todo.save({validateBeforeSave:false})
    
    res.status(200).json(new apiResponse(200,todo,"Todo toggled successfully"))
})

const getTodoById = asyncHandler(async (req,res) => {
    const {todoId} = req.params
    const todo = await Todo.findById(todoId)
    if(!todo){
        throw new apiError(404,"Todo does not exist")
    }
    res.status(200).json(new apiResponse(200,todo,"fetched todo by id"))
    
})

export{
    createTodo,
    updateTodo,
    deleteTodo,
    getAllTodo,
    toggleTodoStatusDone,
    getTodoById
}