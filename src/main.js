// main.js
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// DataTables CSS (core + Buttons)
import 'datatables.net-bs5/css/dataTables.bootstrap5.css'
import 'datatables.net-buttons-bs5/css/buttons.bootstrap5.css'

import './firebase/init'
import 'datatables.net-bs5' // optional: safe to keep or remove if imported per-view

import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

const app = createApp(App)

// expose env on window for debugging everywhere
window.SENDMAIL_URL = import.meta.env.VITE_SENDMAIL_URL || '/api/send-email'
console.log('VITE_SENDMAIL_URL =', window.SENDMAIL_URL)
window.__VITE_MAPBOX_TOKEN__ = import.meta.env.VITE_MAPBOX_TOKEN
console.log(
  'VITE_MAPBOX_TOKEN (prod check):',
  window.__VITE_MAPBOX_TOKEN__ ? window.__VITE_MAPBOX_TOKEN__.slice(0, 8) + '…' : 'MISSING'
)

app.use(router)
app.mount('#app')
