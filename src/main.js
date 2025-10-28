import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'          
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { createApp } from 'vue'                 
import App from './App.vue'
import router from './router'  
import './firebase/init'
import 'datatables.net-bs5/css/dataTables.bootstrap5.css';


const app = createApp(App)

// expose env on window for debugging everywhere
window.SENDMAIL_URL = import.meta.env.VITE_SENDMAIL_URL || '/api/send-email'
console.log('VITE_SENDMAIL_URL =', window.SENDMAIL_URL)

app.use(router)                                 
app.mount('#app')
