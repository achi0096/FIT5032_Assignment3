// init.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChV-6qoF01t48ZXKNi_irW3KD9bMgowSY",
  authDomain: "assignment3-66074.firebaseapp.com",
  projectId: "assignment3-66074",
  storageBucket: "assignment3-66074.appspot.com", 
  messagingSenderId: "849807210801",
  appId: "1:849807210801:web:1acf70e873122515249810",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export { app, auth, db, googleProvider };