/**
 * File: stores/dashboard.js
 * Deskripsi: Store untuk mengelola state dan data dashboard
 * Fungsi: Menangani pengambilan dan pengelolaan data statistik dashboard
 */

import { defineStore } from "pinia";
import { axiosInstance } from "@/plugins/axios";
import { handleError } from "@/helpers/errorHelper";

// Membuat store dashboard
export const useDashboardStore = defineStore("dashboard", {
  // State: Data yang disimpan dalam store
  state: () => ({
    statistics: null,    // Data statistik dashboard
    loading: false,      // Status loading untuk operasi async
    error: null,         // Pesan error jika ada
    success: null,       // Pesan sukses jika ada
  }),

  // Getters: Cara mengambil data dari state (saat ini dinonaktifkan)
  // getters: {
  //   getStatistics: (state) => state.statistics,
  //   isLoading: (state) => state.loading,
  //   hasError: (state) => !!state.error,
  //   getError: (state) => state.error,
  // },

  // Actions: Fungsi untuk mengubah state
  actions: {
    // Fungsi untuk mengambil data statistik dashboard
    async fetchStatistics() {
      this.loading = true;
      // this.error = null;
      // this.success = null;

      try {
        // Kirim request ke API untuk mengambil statistik
        const response = await axiosInstance.get('/dashboard/statistics');

        // Update state dengan data statistik
        this.statistics = response.data.data;
        this.success = 'Statistics fetched successfully';

      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },

    // Fungsi untuk mereset state store (saat ini dinonaktifkan)
    // resetState() {
    //   this.statistics = {
    //     totalComplaints: 0,
    //     pendingComplaints: 0,
    //     resolvedComplaints: 0,
    //     recentComplaints: [],
    //   };
    //   this.loading = false;
    //   this.error = null;
    //   this.success = null;
    // },
  },
});




