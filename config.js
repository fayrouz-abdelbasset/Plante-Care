import fs from "fs";
import path from "path";
import admin from "firebase-admin";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// تحويل import.meta.url إلى __dirname بشكل صحيح
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path صحيح للـ serviceAccountKey.json
const serviceAccountPath = path.resolve(__dirname, "config", "serviceAccountKey.json");

// قراءة الملف
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Firestore
export const db = admin.firestore();
export default admin;
