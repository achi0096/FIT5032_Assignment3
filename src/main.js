import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'          
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { createApp } from 'vue'                 
import App from './App.vue'
import router from './router'  
import './firebase/init'


const app = createApp(App)
app.use(router)                                 
app.mount('#app')
