// TODO: Import necessary dependencies
// Hint: You'll need pinia, axios instance, error helper, and router

import { handleError } from "vue";

export const useTicketStore = defineStore("ticket", {
    state: () => ({
        // TODO: Define your state properties
        // Hint: You'll need tickets array, loading, error, and success states
        tickets : [],
        loading : false,
        error : null,
        success : null
    }),

    actions: {
        async fetchTickets(params) {
            // TODO: Implement fetchTickets action
            // Steps:
            // 1. Set loading state
            // 2. Make API call to tickets endpoint with params
            // 3. Update tickets state
            // 4. Handle error
            // 5. Reset loading state

            this.loading = true;

            try {
                
                const response = await axiosInstace.get('ticket', {params});

                this.tickets = response.data.data;
            } catch (error) {
                this.error = handleError(error);   
            }finally{
                this.loading = false
            }

        },

        async fetchTicket(code) {
            // TODO: Implement fetchTicket action
            // Steps:
            // 1. Set loading state
            // 2. Make API call to get ticket details
            // 3. Return ticket data
            // 4. Handle error
            // 5. Reset loading state
        },

        async createTicket(payload) {
            // TODO: Implement createTicket action
            // Steps:
            // 1. Set loading state
            // 2. Make API call to create ticket
            // 3. Set success message
            // 4. Redirect to dashboard
            // 5. Handle error
            // 6. Reset loading state
        },

        async createTicketReply(code, payload) {
            // TODO: Implement createTicketReply action
            // Steps:
            // 1. Set loading state
            // 2. Make API call to create reply
            // 3. Set success message
            // 4. Return reply data
            // 5. Handle error
            // 6. Reset loading state
        },
    }
})