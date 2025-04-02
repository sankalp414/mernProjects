import Router from "express"
import {
    createTodo, 
    deleteTodo, 
    getAllTodos, 
    toggleTodoStatusDone, 
    updateTodo ,
    getTodoById
} from "../controllers/todo.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"
const router = Router()

router.route("/").post(verifyJWT,createTodo).get(getAllTodos)
router.route("/:todoId").post(verifyJWT,getTodoById)


