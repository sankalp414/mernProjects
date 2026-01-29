import express from "express"
import dotenv from "dotenv"
dotenv.config({
    path:"./.env"
})
const app = express()

app.get('/',(req,res)=>{
    res.json({messg:"Welcom to the app"})

})

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`Listenning to port ${port}`)
})