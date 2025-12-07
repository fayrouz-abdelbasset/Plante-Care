import admin from "firebase-admin";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// المسار الصحيح للملف
const serviceAccountPath = path.join(__dirname, "config", "serviceAccountKey.json");

// قراءة JSON
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// تصحيح الـ private_key
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export Firestore DB
export const db = admin.firestore();
export default admin;
