import {Router} from "express"
import * as controller from "./controller.js"
import * as middleware from "../middleware/auth.middleware.js"

const router:Router = Router()

router.use(middleware.extractUser())

router.post("/signup", controller.signup)
router.post("/signin", controller.signin)
router.get("/refresh/:token", controller.refresh)
router.get("/signout", middleware.allowUser(), controller.signout)
router.get("/me", middleware.allowUser(), controller.me)

export default router