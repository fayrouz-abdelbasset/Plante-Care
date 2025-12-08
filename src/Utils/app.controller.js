
import  authRouter from "../Modules/Auth/auth.controller.js";
import  userRouter from "../Modules/Users/user.controller.js";
import { globalErrorHandler } from "./errorHandler.utils.js";


const bootstrap = async(app , express)=>{

app.use(express.json());

  app.get("/" , (req,res)=>{
  return res.status(200).json({message : "Done"})
  });

  app.use("/api/v1/auth" , authRouter)
  app.use("/api/v1/user" , userRouter)
 app.all("/*dummy" , (req,res)=>{
   return res.status(404).json({message : "Not Found Handler!!!"})
 })

  app.use(globalErrorHandler);

}
export default bootstrap ;