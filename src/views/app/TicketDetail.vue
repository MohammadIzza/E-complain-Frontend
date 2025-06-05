<!--
  File: views/app/TicketDetail.vue
  Deskripsi: Komponen halaman detail complain
  Fungsi: Menampilkan detail complain dan menangani proses balas complain
-->

<script setup>
// Import library yang dibutuhkan
import { ref, onMounted } from 'vue'  // Vue Composition API
import { useRoute } from 'vue-router'  // Router untuk mengakses parameter route
import { useTicketStore } from '@/stores/ticket'  // Store untuk manajemen ticket
import { storeToRefs } from 'pinia'  // Helper untuk reactive store
import { capitalize } from 'lodash'  // Utility function untuk kapitalisasi string
import feather from 'feather-icons'  // Library untuk icon
import { DateTime } from 'luxon'  // Library untuk format tanggal

// Inisialisasi route
const route = useRoute()

// Inisialisasi store ticket
const ticketStore = useTicketStore()
// Destructure state dari store (membuat reactive)
const { loading, error, success } = storeToRefs(ticketStore)
// Destructure action dari store
const { fetchTicket, createTicketReply } = ticketStore

// State untuk data ticket dan form balasan
const ticket = ref({})  // Data ticket yang akan ditampilkan
const form = ref({
  content: '',  // Isi balasan
})

// Fungsi untuk mengambil detail ticket
const fetchTicketDetail = async () => {
  try {
    const response = await fetchTicket(route.params.code)  // Ambil data ticket berdasarkan kode
    ticket.value = response  // Simpan data ticket
    form.value.status = response.status  // Set status ticket
  } catch (e) {
    // Error ditangani oleh store
  }
}

// Handler untuk submit balasan
const handleSubmit = async () => {
  try {
    await createTicketReply(route.params.code, form.value)  // Kirim balasan
    await fetchTicketDetail()  // Refresh data ticket
    error.value = null  // Reset error
    form.value.content = null  // Reset form
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
  <div>
    <!-- Tombol kembali -->
    <div class="mb-6">
      <RouterLink :to="{ name: 'app.dashboard' }"
        class="inline-flex items-center text-sm text-gray-600 hover:text-gray-800">
        <i data-feather="arrow-left" class="w-4 h-4 mr-2"></i>
        Kembali ke Daftar Complain
      </RouterLink>
    </div>

    <!-- Loading & Error State -->
    <div v-if="loading" class="text-center py-10">
      <span>Loading...</span>
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-500">
      <span>{{ error }}</span>
    </div>
    <div v-else>
      <!-- Info ticket -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">{{ ticket.title }}</h1>
              <!-- Badge status dan info ticket -->
              <div class="mt-2 flex items-center space-x-4">
                <!-- Badge status -->
                <span class="px-3 py-1 text-sm font-medium rounded-full"
                  :class="{                    
                    'text-blue-700 bg-blue-100': ticket.status === 'open',
                    'text-yellow-700 bg-yellow-100': ticket.status === 'onprogres',
                    'text-green-700 bg-green-100': ticket.status === 'resolved',
                    'text-red-700 bg-red-100': ticket.status === 'rejected'
                  }">
                  {{ capitalize(ticket.status) }}
                </span>
                <!-- Badge prioritas -->
                <span class="px-3 py-1 text-sm font-medium rounded-full"
                  :class="{
                    'text-red-700 bg-red-100': ticket.priority === 'high',
                    'text-yellow-700 bg-yellow-100': ticket.priority === 'medium',
                    'text-green-700 bg-green-100': ticket.priority === 'low'
                  }">
                  {{ capitalize(ticket.priority) }}
                </span>
                <!-- Kode ticket -->
                <span class="text-sm text-gray-500">#{{ ticket.code }}</span>
                <!-- Tanggal pembuatan -->
                <span class="text-sm text-gray-500">
                  Dibuat pada {{ DateTime.fromISO(ticket.created_at).toFormat('dd MMMM yyyy, HH:mm') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Thread diskusi -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <!-- Header thread -->
        <div v-if="ticket.complain_replies?.length > 0">
          <!-- List balasan -->
          <div class="p-6 border-b border-gray-100" v-for="reply in ticket.complain_replies" :key="reply.id">
            <div class="flex items-start space-x-4">
              <!-- Avatar user -->
              <img :src="`https://ui-avatars.com/api/?name=${reply.user.name}&background=0D8ABC&color=fff`" alt="User"
                class="w-10 h-10 rounded-full">
              <div class="flex-1">
                <!-- Info user dan waktu -->
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-800">{{ reply.user.name }}</h4>
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
            <p class="text-sm text-gray-500">Belum ada balasan</p>
          </div>
        </div>

        <!-- Form balasan -->
        <div class="p-6 border-t border-gray-100">
          <h4 class="text-sm font-medium text-gray-800 mb-4">Tambah Balasan</h4>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Input balasan -->
            <div class="group">
              <textarea v-model="form.content"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                :class="{ 'border-red-500 ring-red-500': error?.content }" rows="4"
                placeholder="Tulis balasan Anda di sini..." minlength="10"></textarea>
              <!-- Error message -->
              <p class="mt-1 text-xs text-red-500" v-if="error?.content">
                {{ error?.content?.join(', ') }}
              </p>
            </div>
            <!-- Tombol aksi -->
            <div class="flex items-center justify-between">
              <!-- Tombol submit -->
              <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                :disabled="loading">
                <i data-feather="send" class="w-4 h-4 inline-block mr-2"></i>
                {{ loading ? 'Mengirim...' : 'Kirim Balasan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>