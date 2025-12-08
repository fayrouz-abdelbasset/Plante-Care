

import admin, { db } from "../../../config.js"; 
import { successResponse } from "../../Utils/successResponse.utils.js";
 export const signup =async(req , res , next)=>{
     const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

    const checkUser = await db.collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

     if(!checkUser.empty){
       return next(new Error("User Already Exists" ,{cause : 409}))
     }


    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

 
    await db.collection("users").doc(user.uid).set({
      name,
      email,
      password,
      createdAt: new Date(),
    });

     return successResponse({res,statusCode:201
      ,message:"User created Succesfully 🎉" ,
      data: {user} })
      };




 export const login = async(req , res ,next)=>{
     const { email, password } = req.body;

    const checkUser = await db.collection("users")
    .where("email", "==", email)
    .where("password" , "==" , password)
    .limit(1)
    .get();

     if(checkUser.empty){
             return next(new Error("User Not Found👨‍🦯" ,{cause : 404}))
     }
    
    
     return successResponse({res,statusCode:200
      ,message:"User Logged in  Succesfully 🎉" ,
      data: {checkUser} });
      
};




