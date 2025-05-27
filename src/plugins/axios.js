import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'

const token = Cookies.get('token')

axios.defaults.baseURL = 'http://localhost:8000/api'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data' // Perhatikan ini mungkin spesifik untuk kasus tertentu, application/json lebih umum untuk data biasa
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

// Ubah Content-Type default
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Aktifkan error interceptor
axios.interceptors.request.use(
  config => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Tambahkan response interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      Cookies.remove('token')
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  }
)


export const axiosInstance = axios