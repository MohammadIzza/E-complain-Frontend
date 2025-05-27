import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// import { axiosInstance } from '@/plugins/axios'
// import { useAuthStore } from '@/stores/auth'

// Create app instance
const app = createApp(App)

// Create pinia instance
const pinia = createPinia()
app.use(pinia)

// Use router
app.use(router)

// // Global error handler
// app.config.errorHandler = (err, vm, info) => {
//   console.error('Global error:', err)
//   const authStore = useAuthStore()
//   authStore.error = err.message || 'An error occurred'
// }

// // Global properties
// app.config.globalProperties.$axios = axiosInstance

// Mount app
app.mount('#app')
