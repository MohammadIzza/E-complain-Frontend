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
        
        // Update user state
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
      // this.loading = true;
      // this.error = null;

      // try {
      //   // Get user data from /me endpoint
      //   const response = await axiosInstance.get('me');
      //   this.user = response.data;
      //   this.loading = false; // Set loading false on success
      //   return true; // Indicate successful authentication
      // } catch (error) {
      //   this.user = null; // Clear user on any error
      //   Cookies.remove('token'); // Remove token on any error
        
      //   // Handle specific errors (e.g., 401)
      //   if (error.response?.status === 401) {
      //      // Already redirected by interceptor or router guard will handle login page redirect
      //      // No need to push to login here to avoid multiple redirects
      //      this.error = null; // Clear specific auth error message here if interceptor handles redirect message
      //      this.loading = false;
      //      return false; // Indicate authentication failed
      //   }

      //   // Handle network errors (timeout, connection refused, etc.)
      //   if (axios.isCancel(error) || !error.response) {
      //     this.error = 'Could not connect to the server. Please try again later.'; // Set a specific network error message
      //     console.error('Authentication check network error:', error);
      //     this.loading = false;
      //     return false; // Indicate authentication failed due to network
      //   }

      //   // Handle other HTTP errors (e.g., 500)
      //   this.error = handleError(error); // Use helper for other errors
      //   console.error('Authentication check HTTP error:', error);
      //   this.loading = false;
      //   return false; // Indicate authentication failed
      // }
    },

    // // Reset store state
    // resetState() {
    //   this.user = null;
    //   this.loading = false;
    //   this.error = null;
    //   this.success = null;
    // }
  },
});
