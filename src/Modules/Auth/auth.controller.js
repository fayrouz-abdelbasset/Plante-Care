import {Router} from "express";
import * as authSerive from "./auth.service.js";
const router = Router();

router.post("/signup" ,authSerive.signup );
router.post("/login" ,authSerive.login )


export  default router ; 