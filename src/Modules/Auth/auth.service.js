

import admin, { db } from "../../../config.js"; 


 export const signup = async(req , res)=>{
     const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {

    const checkUser = await db.collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

     if(checkUser){
       return res.status(409).json({message : "User Alredy Exists"});

     }
    
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

 
    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
      createdAt: new Date(),
    });


    return res.status(201).json({ message: "User created Succesfully 🎉", user});
  } catch (error) {
    return res.status(500).json({message : "Internal Server Erro" , error});
  }
};



 export const login = async(req , res)=>{
     const { email, password } = req.body;


  try {

    const checkUser = await db.collection("users")
    .where("email", "==", email)
    .where("password" , "==" , password)
    .limit(1)
    .get();

     if(!checkUser){
       return res.status(404).json({message : "User Not Found👨‍🦯"});
     }
    
    

    return res.status(200).json({ message: "User Logged in  Succesfully 🎉", checkUser});
  } catch (error) {
    return res.status(500).json({message : "Internal Server Erro" , error});
  }
};





