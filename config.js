import admin from "firebase-admin";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const serviceAccountPath = path.join(__dirname, "config", "serviceAccountKey.json");


const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


export const db = admin.firestore();
export default admin;
