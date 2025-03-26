import Router from "express"
import { loginUser, registerUser } from "../controllers/user.controller"


const router = Router()


router.route("/login",loginUser)
router.route("/register",registerUser)
router.route("/logout",)