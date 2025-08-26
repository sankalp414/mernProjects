import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})

const port = process.env.PORT || 5000

connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server is serinvg at port ${port}`)
    })
})
.catch((error)=>{
    console.error(`Server not serving`,error)
})

