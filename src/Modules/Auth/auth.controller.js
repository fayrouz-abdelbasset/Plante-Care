import {Router} from "express";
import * as authSerive from "./auth.service.js";
import { authentication } from "../../Middleware/auth.middleware.js";
const router = Router();

router.post("/signup" ,authSerive.signup );
router.post("/login" ,authSerive.login )
router.post("/logout",authentication ,authSerive.logout)
router.post("/refresh-token" ,authSerive.refreshToken)



export  default router ; 