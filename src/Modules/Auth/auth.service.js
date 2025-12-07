

import admin, { db } from "../../../config.js"; 
import { asyncHandler } from "../../Utils/asyncHandler.utils.js";

 export const signup =asyncHandler( async(req , res)=>{
     const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

    const checkUser = await db.collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

     if(!checkUser.empty){
       return res.status(409).json({message : "User Alredy Exists"});
     }


    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

 
    await db.collection("users").doc(user.uid).set({
      name,
      email,
      createdAt: new Date(),
    });


    return res.status(201).json({ message: "User created Succesfully 🎉", user});
});

 export const login =asyncHandler( async(req , res)=>{
     const { email, password } = req.body;



    const checkUser = await db.collection("users")
    .where("email", "==", email)
    .where("password" , "==" , password)
    .limit(1)
    .get();

     if(!checkUser){
       return res.status(404).json({message : "User Not Found👨‍🦯"});
     }
    
    

    return res.status(200).json({ message: "User Logged in  Succesfully 🎉", checkUser});
 
});




