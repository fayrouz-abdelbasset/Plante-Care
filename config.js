

import admin from "firebase-admin";
import fs from "fs";


const serviceAccountPath = "D:\\p3\\config\\serviceAccountKey.json"; 


const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));


serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


export const db = admin.firestore();
export default admin;