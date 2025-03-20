import { Router } from "express";
import { loggedOut, loginUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)


router.route("logout").post(verifyJwt,loggedOut)


export default router