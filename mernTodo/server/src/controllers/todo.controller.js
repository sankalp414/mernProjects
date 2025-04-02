import { Todo } from "../models/todo.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllTodos = asyncHandler(async(req,res)=>{
    const {query,complete} = req.query
    const todos = await Todo.aggregate([
        {
            $match: query?.length > 0
            ?
            {
                title:{
                    $regex: query.trim(),
                    $options: "i"
                },
            }:{},
        },
        {
            $match: complete
            ?{
                isComplete: JSON.parse(complete)
            }:{},
        },
        {
            $sort:{
                updatedAt:-1,
            }
        }
    ])
    return res
    .status(200)
    .json(new apiResponse(200,todos,"All fetched successFully"))
})


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
const updateTodo = asyncHandler(async(req,res)=>{
    const todoId = await User.findById(Todo._id)
    if(!todoId){
        throw new apiError(400,"Todo not found")
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
        todoId,
        {
        $set:{
            title,
            content
        }
        },
        {
            new:true,
        })
    return res
    .status(200)
    .json(new apiResponse(200,updatedTodo,"Todo updated"))

})

const toggleTodoStatusDone = asyncHandler(async(req,res)=>{
    const {todoId} = req.params
    const todo = await Todo.findById(todoId)
    if(!todo){
        throw new apiError(404,"Todo does not exist")
    }
    todo.isComplete = !todo.isComplete
    await todo.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        200,
        todo,
        `Todo marked ${todo.isComplete ? "done" : "undone"}`
    )

}) 

const deleteTodo = asyncHandler(async(req,res)=>{
    const {todoId} = req.params
    const todo = await Todo.findByIdAndDelete(todoId)
    if(!todo){
        throw new apiError(404,"Todo not found")
    }
    return res
    .status(200)
    .json(200,{deleteTodo:todo},"Todo deleted successfully")
    
})

export{
    createTodo,
    getTodoById,
    updateTodo,
    toggleTodoStatusDone,
    deleteTodo,
    getAllTodos
}

