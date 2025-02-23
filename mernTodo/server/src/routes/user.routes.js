import {Router} from "express"
import { RegisterUser } from "../controllers/user.controller"

const router = Router()

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),RegisterUser)


export default router