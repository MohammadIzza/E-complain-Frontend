<!--
  File: views/admin/Dashboard.vue
  Deskripsi: Komponen halaman dashboard admin
  Fungsi: Menampilkan statistik dan grafik distribusi status complain
-->

<script setup>
// Import library yang dibutuhkan
import { onMounted, watch } from 'vue'  // Vue Composition API
import { Chart } from 'chart.js/auto'  // Library untuk membuat grafik
import { useDashboardStore } from '@/stores/dashboard'  // Store untuk data dashboard
import { useTicketStore } from '@/stores/ticket'  // Store untuk manajemen ticket
import { storeToRefs } from 'pinia'  // Helper untuk reactive store
import feather from 'feather-icons'  // Library untuk icon
import { capitalize } from 'lodash'  // Utility function untuk kapitalisasi string
import { DateTime } from 'luxon'  // Library untuk format tanggal

// Inisialisasi store dashboard
const dashboardStore = useDashboardStore()
// Destructure state dari store (membuat reactive)
const { statistics } = storeToRefs(dashboardStore)
// Destructure action dari store
const { fetchStatistics } = dashboardStore

// Inisialisasi store ticket
const ticketStore = useTicketStore()
// Destructure state dari store (membuat reactive)
const { tickets } = storeToRefs(ticketStore)
// Destructure action dari store
const { fetchTickets } = ticketStore

// Fungsi untuk toggle menu ticket
const toggleTicketMenu = (ticket) => {
  ticket.showMenu = !ticket.showMenu
}

// Variabel untuk menyimpan instance chart
let chart = null

// Watch perubahan statistics untuk update chart
watch(statistics, () => {
  if (statistics.value && chart) {
    // Update data chart
    chart.data.datasets[0].data = [
      statistics.value.status_distribution?.open,
      statistics.value.status_distribution?.onprogres,
      statistics.value.status_distribution?.resolved,
      statistics.value.status_distribution?.rejected 
    ]
    chart.update()
  }
}, { deep: true })

// Lifecycle hook: dijalankan setelah komponen di-mount
onMounted(async () => {
  // Fetch data
  await fetchTickets()
  await fetchStatistics()

  // Inisialisasi chart
  const statusCtx = document.getElementById('statusChart')?.getContext('2d')

  if (statusCtx && statistics.value) {
    // Buat chart baru
    chart = new Chart(statusCtx, {
      type: 'doughnut',  // Tipe chart
      data: {
        labels: ['open', 'onprogres', 'resolved', 'rejected'],  // Label status
        datasets: [{
          data: [
            statistics.value.status_distribution?.open,
            statistics.value.status_distribution?.onprogres,
            statistics.value.status_distribution?.resolved,
            statistics.value.status_distribution?.rejected 
          ],
          backgroundColor: [  // Warna untuk setiap status
            '#3B82F6',  // Biru untuk open
            '#F59E0B',  // Kuning untuk onprogres
            '#10B981',  // Hijau untuk resolved
            '#EF4444'   // Merah untuk rejected
          ]
        }]
      },
      options: {
        responsive: true,  // Chart responsif
        plugins: {
          legend: {
            position: 'bottom'  // Posisi legend
          }
        },
        cutout: '70%'  // Ukuran donut hole
      }
    })
  }
  feather.replace()  // Inisialisasi icon feather
})
</script>

<template>
  <!-- Card statistik -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Card total complain -->
    <div class="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Total Complain</p>
          <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ statistics?.total_complains }}</h3>
        </div>
        <div class="p-3 bg-blue-50 rounded-lg">
          <i data-feather="tag" class="w-6 h-6 text-blue-600"></i>
        </div>
      </div>
    </div>

    <!-- Card complain aktif -->
    <div class="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Complain Aktif</p>
          <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ statistics?.active_complains }}</h3>
        </div>
        <div class="p-3 bg-yellow-50 rounded-lg">
          <i data-feather="clock" class="w-6 h-6 text-yellow-600"></i>
        </div>
      </div>
    </div>

    <!-- Card complain selesai -->
    <div class="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Selesai</p>
          <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ statistics?.resolved_complains }}</h3>
        </div>
        <div class="p-3 bg-green-50 rounded-lg">
          <i data-feather="check-circle" class="w-6 h-6 text-green-600"></i>
        </div>
      </div>
    </div>

    <!-- Card rata-rata waktu -->
    <div class="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Rata-rata Waktu</p>
          <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ statistics?.avg_resolution_time }} Jam</h3>
        </div>
        <div class="p-3 bg-purple-50 rounded-lg">
          <i data-feather="clock" class="w-6 h-6 text-purple-600"></i>
        </div>
      </div>
    </div>
  </div>

  <!-- Grafik dan daftar ticket -->
  <div class="grid grid-cols-12 gap-6">
    <!-- Daftar ticket terbaru -->
    <div class="col-span-8 bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">Complain Terbaru</h3>
          <a href="#" class="text-sm text-blue-600 hover:text-blue-800 font-medium">Lihat
            Semua</a>
        </div>
      </div>
      <div class="divide-y divide-gray-100">
        <!-- Item ticket -->
        <div v-for="ticket in tickets" :key="ticket.code" class="p-4 hover:bg-gray-50">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-800">{{ ticket.title }}</h4>
              <p class="text-xs text-gray-500 mt-1">#{{ ticket.code }}</p>
              <div class="flex items-center mt-2 space-x-2">
                <!-- Badge status -->
                <span class="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                  {{ capitalize(ticket.status) }}
                </span>
                <!-- Waktu pembuatan -->
                <span class="text-xs text-gray-500">
                  {{ DateTime.fromISO(ticket.created_at).toRelative() }}
                </span>
              </div>
            </div>
            <!-- Menu aksi -->
            <div class="relative">
              <button @click="toggleTicketMenu(ticket)" class="text-gray-400 hover:text-gray-600">
                <i data-feather="more-vertical" class="w-5 h-5"></i>
              </button>
              <!-- Dropdown menu -->
              <div v-show="ticket.showMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                <a :href="`/ticket/${ticket.code}`"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <i data-feather="eye" class="w-4 h-4 inline-block mr-2"></i>
                  Lihat Detail
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grafik distribusi status -->
    <div class="col-span-4 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Distribusi Status</h3>
      <canvas id="statusChart" height="300"></canvas>
    </div>
  </div>
</template>