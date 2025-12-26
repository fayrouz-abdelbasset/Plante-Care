import {Router} from "express";
import * as userService from "./user.service.js"
import { authentication } from "../../Middleware/auth.middleware.js";
const router = Router();
router.patch("/update" ,authentication, userService.updateProfile);



export  default router ; 