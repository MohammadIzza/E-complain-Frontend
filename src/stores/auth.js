/**
 * File: stores/auth.js
 * Deskripsi: Store untuk mengelola state autentikasi
 * Fungsi: Menangani login, register, logout, dan pengecekan status autentikasi
 */

import { defineStore } from "pinia";
import { axiosInstance } from "@/plugins/axios";
import { handleError } from "@/helpers/errorHelper";
import router from "@/router";
import Cookies from "js-cookie";
import axios from 'axios';

// Membuat store autentikasi
export const useAuthStore = defineStore("auth", {
  // State: Data yang disimpan dalam store
  state: () => ({
    user: null,        // Data user yang sedang login
    loading: false,    // Status loading untuk operasi async
    error: null,       // Pesan error jika ada
    success: null,     // Pesan sukses jika ada
  }),

  // Getters: Cara mengambil data dari state
  getters: {
    // Mengambil token dari cookies
    token: () => Cookies.get('token'),
    // Mengecek apakah user sudah login
    isAuthenticated: (state) => !!state.user,
  },

  // Actions: Fungsi untuk mengubah state
  actions: {
    // Fungsi untuk login
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        // Kirim request login ke API
        const response = await axiosInstance.post('/login', credentials);
        const token = response.data.data.token;
        
        // Simpan token di cookies
        Cookies.set('token', token);
        
        // Update state user
        this.user = response.data.data.user;
        
        this.success = response.data.message;

        // Redirect ke dashboard sesuai role
        if(response.data.data.user.role === 'admin'){
          router.push({name : 'admin.dashboard'});
        }else {
          router.push({name : 'app.dashboard'});  
        }
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },

    // Fungsi untuk register
    async register(credentials) {
      this.loading = true;  

      try {
        // Kirim request register ke API
        const response = await axiosInstance.post('/register', credentials);
        this.success = response.data.message;

        const token = response.data.data.token;
        
        // Simpan token di cookies
        Cookies.set('token', token);
        
        // Redirect ke dashboard
        router.push({ name: 'app.dashboard' });
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },

    // Fungsi untuk logout
    async logout() {
      this.loading = true;

      try {
        // Panggil endpoint logout
        const response = await axiosInstance.post('/logout')
        
        // Hapus token dari cookies
        Cookies.remove('token');
        
        // Reset state user
        this.user = null;
        this.error = null;

        this.success = response.data.message

        // Redirect ke halaman login
        router.push({ name: 'login' });

      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },

    // Fungsi untuk mengecek status autentikasi
    async checkAuth() {
      this.loading = true;
      this.error = null;
    
      try {
        // Ambil data user dari endpoint /me
        const response = await axiosInstance.get('/me');
        this.user = response.data.data.user;
        this.loading = false;
        return true;
      } catch (error) {
        // Reset state jika error
        this.user = null;
        Cookies.remove('token');
        
        // Handle error 401 (Unauthorized)
        if (error.response?.status === 401) {
          this.error = null;
          this.loading = false;
          return false;
        }

        // Handle error koneksi
        if (axios.isCancel(error) || !error.response) {
          this.error = 'Could not connect to the server. Please try again later.';
          console.error('Authentication check network error:', error);
          this.loading = false;
          return false;
        }

        // Handle error lainnya
        this.error = handleError(error);
        console.error('Authentication check HTTP error:', error);
        this.loading = false;
        return false;
      }
    }
  },
});
