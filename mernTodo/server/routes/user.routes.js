import Router from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js"

const router = Router()
router.route("/login").post(loginUser)
router.route("/register").post(registerUser)

router.route("/logout").post(verifyJWT,logoutUser)

export default router