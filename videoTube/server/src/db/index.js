import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`Mongodb connected at ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(`Mongodb not connected`,error)
    }
}

export{connectDB}