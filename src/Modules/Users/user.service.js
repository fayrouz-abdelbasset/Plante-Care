import admin from "firebase-admin";
import { successResponse } from "../../Utils/successResponse.utils.js";

const db = admin.firestore();

export const updateProfile = async (req, res, next) => {
  const { email, name } = req.body;

  if (!req.user || !req.user.id) {
    return next(new Error("User not authenticated", { cause: 401 }));
  }

  const user = db.collection("users").doc(req.user.id);

 
  await user.update({
    name,
    email,
    updatedAt: new Date(),
  });

  
  const updatedUser = await user.get();

  return successResponse({
    res,
    statusCode: 201,
    message: "User updated Succesfully 🎉",
    data: {
      id: updatedUser.id,
      ...updatedUser.data(),
    },
  });
};