/**
 * File: plugins/axios.js
 * Deskripsi: Konfigurasi Axios untuk HTTP requests
 * Fungsi: Mengatur instance Axios dengan interceptors dan headers default
 */

import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'

// Ambil token dari cookies
const token = Cookies.get('token')

// Konfigurasi default untuk Axios
axios.defaults.baseURL = 'http://localhost:8000/api'  // URL dasar API
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'  // Menandai request sebagai AJAX
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'  // Format data default
axios.defaults.headers.common['Accept'] = 'application/json'  // Menerima response dalam format JSON
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`  // Token autentikasi

// Ubah Content-Type default ke JSON
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Interceptor untuk request
// Akan dijalankan sebelum request dikirim
axios.interceptors.request.use(
  config => {
    // Ambil token terbaru dari cookies
    const token = Cookies.get('token')
    if (token) {
      // Tambahkan token ke header Authorization
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Interceptor untuk response
// Akan dijalankan setelah response diterima
axios.interceptors.response.use(
  response => response,
  error => {
    // Jika response error dengan status 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Hapus token dari cookies
      Cookies.remove('token')
      // Redirect ke halaman login
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  }
)

// Export instance Axios yang sudah dikonfigurasi
export const axiosInstance = axios