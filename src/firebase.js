// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpZ3XJBEt16hagwI11CALsCh2jgO-Pk2o",
  authDomain: "digital-e-gram-panchayat-4defc.firebaseapp.com",
  projectId: "digital-e-gram-panchayat-4defc",
  storageBucket: "digital-e-gram-panchayat-4defc.firebasestorage.app",
  messagingSenderId: "349269940213",
  appId: "1:349269940213:web:24a1bca3d9cb7dcc0d72bc"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 