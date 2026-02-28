import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA_q4nCebYulpi5rHUHhpzVYUc-CKUwfiA",
  authDomain: "healone-auth.firebaseapp.com",
  projectId: "healone-auth",
  storageBucket: "healone-auth.firebasestorage.app",
  messagingSenderId: "640573382243",
  appId: "1:640573382243:web:6059f8ed0242a20d0f2256",
  measurementId: "G-9JTVEDPQCR"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
