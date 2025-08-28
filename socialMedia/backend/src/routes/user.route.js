import Router from "express"
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express()

router.route("/registerUser").post(registerUser)
router.route("/loginUser").post(loginUser)
router.route("/logoutUser").post(verifyJWT,logoutUser)
router.route("/refresh-access-token").post(refreshAccessToken)