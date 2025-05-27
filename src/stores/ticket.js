
import { defineStore } from "pinia";
import { axiosInstance } from "@/plugins/axios";
import { handleError } from "@/helpers/errorHelper";
import router from "@/router";

export const useTicketStore = defineStore("ticket", {
    state: () => ({
        tickets: [],
        loading: false,
        error: null,
        success: null,
    }),


    actions: {
        async fetchTickets(params) {
            this.loading = true;

            try {
                const response = await axiosInstance.get('complain', { params });
                this.tickets = response.data.data;

                this.success = 'Tickets fetched successfully';
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        async fetchTicket(code) {
            this.loading = true;

            try {
                const response = await axiosInstance.get(`/complain/${code}`);
                this.success = 'Ticket details fetched successfully';
                return response.data.data;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        async createTicket(payload) {
            this.loading = true;

            try {
                const response = await axiosInstance.post('/complain', payload);
                this.success = response.data.message;
                
                // Redirect to ticket detail page
                router.push({ name: 'app.dashboard' });
                
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        async createTicketReply(code, payload) {
            this.loading = true;

            try {
                const response = await axiosInstance.post(`/complain-reply/${code}`, payload);
                this.success = 'Reply added successfully';
                
                // Refresh ticket data to show new reply
                await this.fetchTicket(code);
                
                return response.data.data;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        // Reset store state
        // resetState() {
        //     this.tickets = [];
        //     this.currentTicket = null;
        //     this.loading = false;
        //     this.error = null;
        //     this.success = null;
        //     this.pagination = {
        //         current_page: 1,
        //         total: 0,
        //         per_page: 10
        //     };
        // }
    }
})