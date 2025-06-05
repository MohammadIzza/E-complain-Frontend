<!--
  File: views/admin/ticket/TicketDetail.vue
  Deskripsi: Komponen halaman detail complain untuk admin
  Fungsi: Menampilkan detail complain dan menangani balasan admin
-->

<script setup>
// Import library yang dibutuhkan
import { ref, onMounted } from 'vue'  // Vue Composition API
import { useRoute } from 'vue-router'  // Router untuk mengakses parameter URL
import { useTicketStore } from '@/stores/ticket'  // Store untuk manajemen ticket
import { storeToRefs } from 'pinia'  // Helper untuk reactive store
import feather from 'feather-icons'  // Library untuk icon
import { capitalize } from 'lodash'  // Utility function untuk kapitalisasi
import { DateTime } from 'luxon'  // Library untuk format tanggal

// Inisialisasi route untuk mengakses parameter URL
const route = useRoute()

// State untuk menyimpan data ticket dan form
const ticket = ref({})  // Menyimpan data ticket
const form = ref({
  status: '',    // Status ticket yang akan diupdate
  content: ''    // Isi balasan admin
})

// Inisialisasi store ticket
const ticketStore = useTicketStore()
// Destructure state dari store (membuat reactive)
const { loading, error, success } = storeToRefs(ticketStore)
// Destructure action dari store
const { fetchTicket, createTicketReply } = ticketStore

// Fungsi untuk mengambil detail ticket
const fetchTicketDetail = async () => {
  try {
    const response = await fetchTicket(route.params.code)
    ticket.value = response
    form.value.status = response.status  // Set status form sesuai status ticket
  } catch (e) {
    // Error ditangani oleh store
  }
}

// Handler untuk submit balasan
const handleSubmit = async () => {
  try {
    await createTicketReply(route.params.code, form.value)  // Kirim balasan
    await fetchTicketDetail()  // Refresh data ticket
    error.value = null
    form.value.content = ''  // Reset form content
  } catch (e) {
    // Error ditangani oleh store
  }
}

// Lifecycle hook: dijalankan setelah komponen di-mount
onMounted(async () => {
  await fetchTicketDetail()  // Ambil detail ticket
  feather.replace()  // Inisialisasi icon feather
})
</script>

<template>
  <div class="p-6">
    <!-- Informasi Ticket -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Informasi utama ticket -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800">{{ ticket.title }}</h3>
            <div class="mt-4 flex items-center space-x-4">
              <!-- Badge status -->
              <span class="px-3 py-1 text-sm rounded-lg" :class="{
                'text-blue-700 bg-blue-100': ticket.status === 'open',
                'text-yellow-700 bg-yellow-100': ticket.status === 'onprogres',
                'text-green-700 bg-green-100': ticket.status === 'resolved',
                'text-red-700 bg-red-100': ticket.status === 'rejected'
              }">
                {{ capitalize(ticket.status) }}
              </span>

              <!-- Badge prioritas -->
              <span class="px-3 py-1 text-sm rounded-lg" :class="{
                'text-red-700 bg-red-100': ticket.priority === 'high',
                'text-yellow-700 bg-yellow-100': ticket.priority === 'medium',
                'text-green-700 bg-green-100': ticket.priority === 'low'
              }">
                {{ capitalize(ticket.priority) }}
              </span>

              <!-- Info pelapor -->
              <span class="text-sm text-gray-500">Dilaporkan oleh {{ ticket.user?.name }}</span>
            </div>
          </div>

          <!-- Tombol aksi -->
          <div class="flex items-center justify-end space-x-4">
            <button class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <i data-feather="download" class="w-4 h-4 inline-block mr-2"></i>
              Lampiran
            </button>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              <i data-feather="check-circle" class="w-4 h-4 inline-block mr-2"></i>
              Selesaikan Complain
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Thread Diskusi -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">            
      <!-- Daftar balasan -->
      <div v-if="ticket.complain_replies?.length > 0">
        <div v-for="reply in ticket.complain_replies" :key="reply.id" class="p-6 border-b border-gray-100">
          <div class="flex items-start space-x-4">
            <!-- Avatar pengguna -->
            <img :src="`https://ui-avatars.com/api/?name=${reply.user?.name}&background=0D8ABC&color=fff`"
              :alt="reply.user?.name" class="w-10 h-10 rounded-full">
            <div class="flex-1">
              <!-- Info pengguna dan waktu -->
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-800">{{ reply.user?.name }}</h4>
                  <p class="text-xs text-gray-500">
                    {{ DateTime.fromISO(reply.created_at).toFormat('dd MMMM yyyy, HH:mm') }}
                  </p>
                </div>
              </div>
              <!-- Isi balasan -->
              <div class="mt-3 text-sm text-gray-800">
                <p>{{ reply.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Pesan jika belum ada balasan -->
      <div v-else>
        <div class="p-6">
          <p class="text-sm text-gray-500">Belum ada tanggapan</p>
        </div>
      </div>

      <!-- Form balasan -->
      <div class="p-6 border-t border-gray-100">
        <h4 class="text-sm font-medium text-gray-800 mb-4">Tambah Jawaban</h4>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Select status -->
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status Complain</label>
              <select v-model="form.status"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option value="open" class="text-blue-700">Open</option>
                <option value="onprogres" class="text-yellow-700">On Progress</option>
                <option value="resolved" class="text-green-700">Resolved</option>
                <option value="rejected" class="text-red-700">Rejected</option>
              </select>
            </div>
          </div>
          <!-- Textarea balasan -->
          <div>
            <textarea v-model="form.content"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              :class="{'border-red-500 ring-red-500': error?.content}" rows="4"
              placeholder="Tulis Jawaban Anda disini...">
            </textarea>              
            <!-- Pesan error -->
            <p class="mt-1 text-sm text-red-500" v-if="error?.content">
              {{ error?.content?.join(', ') }}
            </p>
          </div>
          <!-- Tombol aksi -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button type="button"
                class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <i data-feather="paperclip" class="w-4 h-4 inline-block mr-2"></i>
                Lampiran
              </button>
            </div>
            <!-- Tombol submit -->
            <button type="submit"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              <i data-feather="send" class="w-4 h-4 inline-block mr-2"></i>
              <span v-if="!loading">
                Kirim Jawaban
              </span>
              <span v-else>
                loading ....
              </span>
            </button> 
          </div>
        </form>
      </div>
    </div>
  </div>
</template>