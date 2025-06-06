<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTicketStore } from '@/stores/ticket'
import { storeToRefs } from 'pinia'
import { debounce, capitalize } from 'lodash'
import feather from 'feather-icons'
import { DateTime } from 'luxon'

// Store
const ticketStore = useTicketStore()
const { tickets, success, loading, error } = storeToRefs(ticketStore)
const { fetchTickets } = ticketStore


// Filters
const filters = ref({
  search: '',
  status: '',
  priority: '',
  date: ''
})

// Watch filters
watch(filters, debounce( async() => {
  await fetchTickets(filters.value)
}, 300), {deep:true})


// On mount
onMounted(async () => {
  await fetchTickets()
  feather.replace()
})

</script>

<template>
  <div>
    <!-- Header section -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Complain Saya</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola dan pantau status Complain Anda</p>
      </div>
      <RouterLink :to="{ name: 'app.complain.create' }"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
        <i data-feather="plus" class="w-4 h-4 mr-2"></i>
        Buat Complain Baru
      </RouterLink>
    </div>

    <!-- Success alert -->
    <div
      class="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative flex items-center justify-between"
      role="alert" v-if="success">
      <div class="flex items-center">
        <i data-feather="check-circle" class="w-5 h-5 mr-2"></i>
        <span>{{ success }}</span>
      </div>
      <button class="flex items-center justify-center" @click="closeSuccess">
        <i data-feather="x" class="w-4 h-4 text-green-600"></i>
      </button>
    </div>

    <!-- Loading & Error State -->
    <div v-if="loading" class="text-center py-10">
      <span>Loading...</span>
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-500">
      <span>{{ error }}</span>
    </div>
    <div v-else>
      <!-- Filters section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="relative">
              <input type="text" placeholder="Cari Complain..." v-model="filters.search"
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <i data-feather="search" class="w-4 h-4 text-gray-400 absolute left-3 top-2.5"></i>
            </div>
            <select v-model="filters.status"
              class="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="">Semua Status</option>
              <option value="open">Open</option>
              <option value="onprogres">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select v-model="filters.priority"
              class="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="">Semua Prioritas</option>
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
            <select v-model="filters.date"
              class="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="">Semua Tanggal</option>
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tickets list -->
      <div class="space-y-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          v-for="ticket in tickets" :key="ticket.code">
          <RouterLink :to="{ name: 'app.complain.detail', params: { code: ticket.code } }" class="block p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h3 class="text-lg font-semibold text-gray-800">{{ ticket.title }}</h3>
                  <span class="px-3 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'text-blue-700 bg-blue-100': ticket.status === 'open',
                      'text-yellow-700 bg-yellow-100': ticket.status === 'onprogres',
                      'text-green-700 bg-green-100': ticket.status === 'resolved',
                      'text-red-700 bg-red-100': ticket.status === 'rejected'
                    }">
                    {{ capitalize(ticket.status) }}
                  </span>
                  <span class="px-3 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'text-red-700 bg-red-100': ticket.priority === 'high',
                      'text-yellow-700 bg-yellow-100': ticket.priority === 'medium',
                      'text-green-700 bg-green-100': ticket.priority === 'low'
                    }">
                    {{ capitalize(ticket.priority) }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-1">#{{ ticket.code }} • Dibuat pada {{
                  DateTime.fromISO(ticket.created_at).toFormat('dd MMMM yyyy, HH:mm') }}</p>
                <p class="text-sm text-gray-600 mt-2">{{ ticket.description }}</p>
                <div class="mt-4 flex items-center space-x-4">
                  <div class="flex items-center text-sm text-gray-500">
                    <i data-feather="message-square" class="w-4 h-4 mr-1"></i>
                    <span>{{ ticket.ticket_replies?.length || 0 }} balasan</span>
                  </div>
                  <div class="flex items-center text-sm text-gray-500">
                    <i data-feather="clock" class="w-4 h-4 mr-1"></i>
                    <span>Terakhir diupdate {{
                      DateTime.fromISO(ticket.updated_at).toFormat('dd MMMM yyyy, HH:mm') }}</span>
                  </div>
                </div>
              </div>
              <div class="ml-4">
                <i data-feather="chevron-right" class="w-5 h-5 text-gray-400"></i>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>