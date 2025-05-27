import { defineStore } from "pinia";
import { axiosInstance } from "@/plugins/axios";
import { handleError } from "@/helpers/errorHelper";
import router from "@/router";
import Cookies from "js-cookie";
import axios from 'axios';

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    success: null,
  }),

  getters: {
    token: () => Cookies.get('token'),
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.post('/login', credentials);
        const token = response.data.data.token;
        
        // Store token in cookies
        Cookies.set('token', token);
        
        // Update user state - tambahkan ini
        this.user = response.data.data.user;
        
        this.success = response.data.message;

        // Redirect to dashboard
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

    async register(credentials) {
      this.loading = true;  

      try {
        const response = await axiosInstance.post('/register', credentials);
        this.success = response.data.message;

        const token = response.data.data.token;
        
        // Store token in cookies
        Cookies.set('token', token);
        
        // Redirect to dashboard
        router.push({ name: 'app.dashboard' });
      } catch (error) {
        this.error = handleError(error);

      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;

      try {
        // Call logout endpoint
        const response = await axiosInstance.post('/logout')
        
        // Remove token from cookies
        Cookies.remove('token');
        
        // Clear user state
        this.user = null;
        this.error = null;

        this.success = response.data.message

        // Redirect to login page
        router.push({ name: 'login' });

      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async checkAuth() {
      this.loading = true;
      this.error = null;
    
      try {
        // Get user data from /me endpoint
        const response = await axiosInstance.get('/me');
        this.user = response.data.data.user; // Sesuaikan dengan struktur response dari API
        this.loading = false;
        return true;
      } catch (error) {
        this.user = null;
        Cookies.remove('token');
        
        if (error.response?.status === 401) {
          this.error = null;
          this.loading = false;
          return false;
        }

        if (axios.isCancel(error) || !error.response) {
          this.error = 'Could not connect to the server. Please try again later.';
          console.error('Authentication check network error:', error);
          this.loading = false;
          return false;
        }

        this.error = handleError(error);
        console.error('Authentication check HTTP error:', error);
        this.loading = false;
        return false;
      }
    }
  },
});
