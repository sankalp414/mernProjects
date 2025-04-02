import Router from "express"
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller"
import { verifyJWT } from "../middlewares/auth.middleware"


const router = Router()


router.route("/login",loginUser)
router.route("/register",registerUser)
router.route("/logout",verifyJWT,logoutUser)
router.route("/refresh-token",verifyJWT,refreshAccessToken)