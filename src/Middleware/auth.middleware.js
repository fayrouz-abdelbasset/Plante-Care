

// import { getFirestore ,doc,getDoc } from "firebase-admin/firestore";
// import { verifyToken } from "../Utils/tokens/token.utils.js";

// const db = getFirestore();

// export const authentication = async (req, res, next) => {
//     const { authorization } = req.headers;

//     if (!authorization) {
//         return next(new Error("authorization token is missing", { cause: 400 }));
//     }

//     const decoded = verifyToken({
//         token: authorization,
//         signature: process.env.TOKEN_ACCESS_SECRET,
//     });

//     if (!decoded.jti) return next(new Error("Invalid Token", { cause: 401 }));

//     // تحقق من أن التوكن مش مرفوض
//     const revokedTokenRef = doc(db, "tokens", decoded.jti);
//     const revokedToken = await getDoc(revokedTokenRef);

//     if (revokedToken.exists()) return next(new Error("Token is Revoked", { cause: 401 }));

//     // جلب اليوزر
//     const userRef = doc(db, "users", decoded.userId); // أو decoded.id حسب التوكن
//     const user = await getDoc(userRef);

//     if (!user.exists()) return next(new Error("User not found", { cause: 404 }));

//     req.user = user.data();
//     next();
// };



import admin from "firebase-admin";
import { verifyToken } from "../Utils/tokens/token.utils.js";
import { TokenModel } from "../DB/models/token.model.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

export const authentication = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new Error("authorization token is missing", { cause: 400 }));
  }
  if(!authorization.startsWith(process.env.TOKEN_PREFIX))  
   return next(new Error("Invalid Authorization Format", { cause: 400 }));

    const token =authorization.split(" ")[1]
  const decoded = verifyToken({
    token,
    secretKey: process.env.TOKEN_ACCESS_SECRET,
  });

  if (!decoded.jti) return next(new Error("Invalid Token", { cause: 401 }));

  const revokedToken = await TokenModel.findOne({ filter: { jwtid: decoded.jti } });
  if (revokedToken) return next(new Error("Token is Revoked", { cause: 401 }));

  // تحقق من وجود userId في التوكن
  const userId = decoded.userId || decoded.id;
  if (!userId) return next(new Error("User ID is missing in token", { cause: 401 }));

  // جلب بيانات اليوزر
  const user = db.collection("users").doc(userId);
  const userSnap = await user.get();

  if (!userSnap.exists) return next(new Error("User not found", { cause: 404 }));

  req.user = { id: userSnap.id, ...userSnap.data() };
  req.decoded = decoded;
  next();
};
