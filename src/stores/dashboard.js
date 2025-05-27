import { defineStore } from "pinia";
import { axiosInstance } from "@/plugins/axios";
import { handleError } from "@/helpers/errorHelper";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    statistics:null,
    loading: false,
    error: null,
    success: null,
  }),

  // getters: {
  //   getStatistics: (state) => state.statistics,
  //   isLoading: (state) => state.loading,
  //   hasError: (state) => !!state.error,
  //   getError: (state) => state.error,
  // },

  actions: {
    async fetchStatistics() {
      this.loading = true;
      // this.error = null;
      // this.success = null;

      try {
        const response = await axiosInstance.get('/dashboard/statistics');

        this.statistics = response.data.data;
        this.success = 'Statistics fetched successfully';

      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },

    // Reset store state
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




