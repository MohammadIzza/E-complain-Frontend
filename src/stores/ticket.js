/**
 * File: stores/ticket.js
 * Deskripsi: Store untuk mengelola state dan operasi terkait ticket/keluhan
 * Fungsi: Menangani operasi CRUD untuk ticket dan balasan ticket
 */

import { defineStore } from "pinia";
import { axiosInstance } from "@/plugins/axios";
import { handleError } from "@/helpers/errorHelper";
import router from "@/router";

// Membuat store ticket
export const useTicketStore = defineStore("ticket", {
    // State: Data yang disimpan dalam store
    state: () => ({
        tickets: [],      // Daftar ticket
        loading: false,   // Status loading untuk operasi async
        error: null,      // Pesan error jika ada
        success: null,    // Pesan sukses jika ada
    }),

    // Actions: Fungsi untuk mengubah state
    actions: {
        // Fungsi untuk mengambil daftar ticket
        async fetchTickets(params) {
            this.loading = true;

            try {
                // Kirim request ke API untuk mengambil daftar ticket
                const response = await axiosInstance.get('/complain', { params });
                this.tickets = response.data.data;
                this.error = null; // Reset error state jika berhasil
            } catch (error) {
                this.error = handleError(error);
                this.tickets = []; // Reset tickets jika error
            } finally {
                this.loading = false;
            }
        },

        // Fungsi untuk mengambil detail ticket berdasarkan kode
        async fetchTicket(code) {
            this.loading = true;

            try {
                // Kirim request ke API untuk mengambil detail ticket
                const response = await axiosInstance.get(`/complain/${code}`);
                this.success = 'Ticket details fetched successfully';
                return response.data.data;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        // Fungsi untuk membuat ticket baru
        async createTicket(payload) {
            this.loading = true;

            try {
                // Kirim request ke API untuk membuat ticket baru
                const response = await axiosInstance.post('/complain', payload);
                this.success = response.data.message;
                
                // Redirect ke halaman dashboard setelah berhasil
                router.push({ name: 'app.dashboard' });
                
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        // Fungsi untuk menambahkan balasan pada ticket
        async createTicketReply(code, payload) {
            this.loading = true;

            try {
                // Kirim request ke API untuk menambahkan balasan
                const response = await axiosInstance.post(`/complain-reply/${code}`, payload);
                this.success = 'Reply added successfully';
                
                // Refresh data ticket untuk menampilkan balasan baru
                await this.fetchTicket(code);
                
                return response.data.data;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        // Fungsi untuk mereset state store (saat ini dinonaktifkan)
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