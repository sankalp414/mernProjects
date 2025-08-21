import Router from "express"
import { createTodo, deleteTodo, getAllTodo, getTodoById, toggleTodoStatusDone, updateTodo } from "../controllers/todo.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/create-todo").post(verifyJWT,createTodo)
router.route("/update-todo").post(verifyJWT,updateTodo)
router.route("/todo-toggle").post(verifyJWT,toggleTodoStatusDone)
router.route("/get-all-todo").get(verifyJWT,getAllTodo)
router.route("/get-todo-by-id").get(verifyJWT,getTodoById)
router.route("/delete-todo").post(verifyJWT,deleteTodo)


export default router