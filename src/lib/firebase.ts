// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "studyunlock-wlzjr",
  "appId": "1:929957392215:web:f2883edaee1b9d62d89812",
  "storageBucket": "studyunlock-wlzjr.firebasestorage.app",
  "apiKey": "AIzaSyAooS7Qfr2tY509CHNutc_8l0D8hOIyMbQ",
  "authDomain": "studyunlock-wlzjr.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "929957392215"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
