import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpTCdvij6S54R9yl1mQpuqD2kAcdTMpaw",
  authDomain: "focus-force-2.firebaseapp.com",
  projectId: "focus-force-2",
  storageBucket: "focus-force-2.firebasestorage.app",
  messagingSenderId: "1033374089628",
  appId: "1:1033374089628:web:d91b1db7cdf103802e0859",
  measurementId: "G-S1PZDF9CGJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// تصدير الخدمات للاستخدام في بقية المكونات (Components)
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
