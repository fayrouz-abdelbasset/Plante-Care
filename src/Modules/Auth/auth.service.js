

import admin, { db } from "../../../config.js"; 
import { successResponse } from "../../Utils/successResponse.utils.js";
import {hash ,compare}   from "../../Utils/Hashing/hash.utils.js"
import { generateToken } from "../../Utils/tokens/token.utils.js";
import {v4 as uuid} from "uuid"
import TokenModel from "../../DB/models/token.model.js";
import { verifyToken } from "../../Utils/tokens/token.utils.js";
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

      const hashedPassword = await hash({plaintext : password});


    const user = await admin.auth().createUser({
      email,
      password: hashedPassword ,
      displayName: name,
    });

 
    await db.collection("users").doc(user.uid).set({
      name,
      email,
      password : hashedPassword ,
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

    .limit(1)
    .get();

     if(checkUser.empty){
             return next(new Error("User Not Found👨‍🦯" ,{cause : 404}))
     }
      const userDoc = checkUser.docs[0]; 
       const userData = userDoc.data();
     if(!(await compare({plaintext:password ,hash :userData.password})))
                 return next(new Error("Invalid Email or Password👨‍🦯" ,{cause : 400}))
      const accessToken =await generateToken({
        payload:{id:userDoc.id,email:checkUser.email},
        secretKey:process.env.TOKEN_ACCESS_SECRET ,
        options:{ expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),jwtid:uuid()}
  
        })

      const refreshToken =await generateToken({
        payload:{id:userDoc.id,email:checkUser.email},
        secretKey:process.env.TOKEN_REFRESH_SECRET,
        options:{expiresIn: Number(process.env.REFRECH_TOKEN_EXPIRES_IN),jwtid:uuid()}
  
        })
    
     return successResponse({res,statusCode:200
      ,message:"User Logged in  Succesfully 🎉" ,
      data: {id:userDoc.id ,email ,accessToken , refreshToken} });
      
};





export const logout = async (req, res, next) => {


  await TokenModel.create({
    data: [
      {
        jwtid: req.decoded.jti,
        expiresIn: new Date(req.decoded.exp * 1000),
        userId: req.user.id, 
      },
    ],
  });


  return successResponse({
    res,
    statusCode: 200,
    message: "Logged out Successfully 🌏",
  });
};



 export const refreshToken = async(req , res ,next)=>{
      // const {refreshToken} = req.headers;
      // const decoded = verifyToken({token:refreshToken,secretKey:process.env.TOKEN_REFRECH_SECRETE});
      // const userDoc = checkUser.docs[0]; 

      // const accessToken =await generateToken({
      //   payload:{id:userDoc.id,email:decoded.email},
      //   secretKey:process.env.TOKEN_ACCESS_SECRETE,
      //   options:{expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),jwtid:uuid()}
  
      //   })



    const  refreshToken  = req.headers.refreshtoken || req.headers['refresh-token'];;

  
    const decoded = verifyToken({
      token: refreshToken,
      secretKey: process.env.TOKEN_REFRESH_SECRET,
    });

    const user = db.collection("users").doc(decoded.id);
    const userSnap = await user.get();
    if (!userSnap.exists) return next(new Error("User not found", { cause: 404 }));

    const userDoc = { id: userSnap.id, ...userSnap.data() };

    
    const accessToken = await generateToken({
      payload: { id: userDoc.id, email: userDoc.email },
      secretKey: process.env.TOKEN_ACCESS_SECRET,
      options: {  expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN), jwtid: uuid() },
    });
     return successResponse({res,statusCode:200
      ,message:"Token Refreshed  Succesfully 🎉" ,
      data: {accessToken} });
      
};
