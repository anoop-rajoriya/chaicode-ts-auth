import {Router} from "express"
import * as controller from "./controller.js"

const router:Router = Router()

router.post("/signup", controller.signup)
router.post("/signin", controller.signin)
router.get("/signout", controller.signout)
router.get("/me", controller.me)

export default router