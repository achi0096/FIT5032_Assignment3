import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'          
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { createApp } from 'vue'                 
import App from './App.vue'
import router from './router'  


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChV-6qoF01t48ZXKNi_irW3KD9bMgowSY",
  authDomain: "assignment3-66074.firebaseapp.com",
  projectId: "assignment3-66074",
  storageBucket: "assignment3-66074.firebasestorage.app",
  messagingSenderId: "849807210801",
  appId: "1:849807210801:web:1acf70e873122515249810"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const app = createApp(App)
app.use(router)                                 
app.mount('#app')
