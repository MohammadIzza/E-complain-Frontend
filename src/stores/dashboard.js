import { createPinia } from "pinia";
import { axiosInstance } from "@/plugins/axios";
import { handleError } from "@/helpers/errorHelper";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    // TODO: Define your state properties
    // Hint: You'll need statistic, loading, error, and success states
    statistic: null,
    loading: false,
    error: null,
    success: null,
  }),

  actions: {
    async fetchStatistics() {
      // TODO: Implement fetchStatistics action
      // Steps:
      // 1. Set loading state
      // 2. Make API call to statistics endpoint
      // 3. Update statistic state
      // 4. Handle error
      // 5. Reset loading state
      this.loading = true;
      try {
        const response = await axiosInstance.get("dashboard/statistics");
        this.statistic = response.data;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
  },
});




