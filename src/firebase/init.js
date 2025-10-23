// init.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChV-6qoF01t48ZXKNi_irW3KD9bMgowSY",
  authDomain: "assignment3-66074.firebaseapp.com",
  projectId: "assignment3-66074",
  storageBucket: "assignment3-66074.appspot.com", // <-- FIXED
  messagingSenderId: "849807210801",
  appId: "1:849807210801:web:1acf70e873122515249810",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
