import {Router} from "express"
import { loginUser, refreshAccessToken, RegisterUser,logoutUser } from "../controllers/user.controller"
import { verifyJwt } from "../middlewares/auth.middleware"

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

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/refresh-token").post(verifyJwt,refreshAccessToken)

export default router