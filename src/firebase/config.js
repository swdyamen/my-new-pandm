// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY_PM,
  authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN_PM,
  projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID_PM,
  storageBucket: import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET_PM,
  messagingSenderId: import.meta.env
    .VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PM,
  appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID_PM,
  measurementId: import.meta.env.VITE_PUBLIC_FIREBASE_MEASUREMENT_ID_PM,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
