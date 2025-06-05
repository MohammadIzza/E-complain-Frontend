/**
 * File: main.js
 * Deskripsi: File utama yang menginisialisasi aplikasi Vue.js
 * Fungsi: Mengatur dan menghubungkan semua komponen utama aplikasi
 */

// Import library Vue.js untuk membuat aplikasi
import { createApp } from 'vue'
// Import Pinia untuk state management (seperti Redux/Vuex)
import { createPinia } from 'pinia'
// Import komponen utama aplikasi
import App from './App.vue'
// Import konfigurasi router
import router from './router'
// Import file CSS utama
import './assets/main.css'  // Tambahkan ini

// Membuat instance aplikasi Vue
const app = createApp(App)
// Membuat instance Pinia untuk state management
const pinia = createPinia()

// Menggunakan Pinia di aplikasi
app.use(pinia)
// Menggunakan Router di aplikasi
app.use(router)

// Memasang aplikasi ke elemen dengan id 'app' di index.html
app.mount('#app')
