import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.static("public"))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb",extended:true}))
app.use(cookieParser())



import UserRouter from "./routes/user.routes.js"
import todoRouter from "./routes/todo.routes.js"

app.use("/api/v1/users",UserRouter)
app.use("/api/v1/todos",todoRouter)




export {app}