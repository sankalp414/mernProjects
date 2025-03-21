import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller";
import { verifyJwt } from "../middlewares/auth.middleware";
refreshAccessToken
const router = Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("logout").post(verifyJwt,logoutUser)
router.route("/refresh-token").post(verifyJwt,refreshAccessToken)


export default router