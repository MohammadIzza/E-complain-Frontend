<!--
  File: views/app/TicketCreate.vue
  Deskripsi: Komponen halaman pembuatan complain baru
  Fungsi: Menampilkan form untuk membuat complain baru dan menangani proses pembuatan
-->

<script setup>
  // Import library yang dibutuhkan
  import { ref, onMounted } from 'vue'  // Vue Composition API
  import { useTicketStore } from '@/stores/ticket'  // Store untuk manajemen ticket
  import { storeToRefs } from 'pinia'  // Helper untuk reactive store
  import feather from 'feather-icons'  // Library untuk icon

  // Inisialisasi store ticket
  const ticketStore = useTicketStore()
  // Destructure state dari store (membuat reactive)
  const { loading, error, success } = storeToRefs(ticketStore)
  // Destructure action dari store
  const { createTicket } = ticketStore

  // State untuk form complain
  const form = ref({
    title: '',        // Judul complain
    description: '',  // Deskripsi masalah
    priority: ''      // Prioritas complain (low/medium/high)
  })

  // Handler untuk submit form
  const handleSubmit = async () => {
    try {
      await createTicket(form.value)  // Panggil action createTicket dari store
    } catch (e) {
      // Error ditangani oleh store
    }
  }

  // Lifecycle hook: dijalankan setelah komponen di-mount
  onMounted(() => {
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

    <!-- Form pembuatan complain -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <!-- Header form -->
      <div class="p-6 border-b border-gray-100">
        <h1 class="text-2xl font-bold text-gray-800">Buat Complain Baru</h1>
        <p class="text-sm text-gray-500 mt-1">Isi form di bawah ini untuk membuat Complain baru</p>
      </div>
      <!-- Form content -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Input judul -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Judul Complain</label>
          <input type="text" id="title" v-model="form.title" placeholder="Contoh: Gangguan Jaringan WiFi"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
          <!-- Error message untuk judul -->
          <div v-if="error?.title" class="flex items-center mt-2">
            <p class="text-xs text-red-500">{{ error.title[0] }}</p>
          </div>
        </div>

        <!-- Input deskripsi -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Deskripsi
            Masalah</label>
          <textarea id="description" v-model="form.description" rows="6"
            placeholder="Jelaskan masalah Anda secara detail. Sertakan informasi seperti:&#10;- Kapan masalah mulai terjadi&#10;- Apa yang sudah Anda coba&#10;- Dampak masalah terhadap pekerjaan"
            class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"></textarea>
          <!-- Error message untuk deskripsi -->
          <div v-if="error?.description" class="flex items-center mt-2">
            <p class="text-xs text-red-500">{{ error.description[0] }}</p>
          </div>
        </div>

        <!-- Input prioritas -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Prioritas</label>
          <div class="grid grid-cols-3 gap-4">
            <!-- Opsi prioritas rendah -->
            <label class="relative flex cursor-pointer rounded-lg border"
              :class="[form.priority === 'low' ? 'border-green-200 bg-green-50' : 'border-gray-200']">
              <input type="radio" v-model="form.priority" value="low" class="sr-only">
              <div class="flex w-full items-center justify-between p-4">
                <div class="flex items-center">
                  <div class="text-sm">
                    <p class="font-medium text-gray-900">Rendah</p>
                    <p class="text-gray-500">Tidak mendesak</p>
                  </div>
                </div>
                <div class="shrink-0 text-green-600" v-show="form.priority === 'low'">
                  <i data-feather="check-circle" class="w-6 h-6"></i>
                </div>
              </div>
            </label>
            <!-- Opsi prioritas sedang -->
            <label class="relative flex cursor-pointer rounded-lg border"
              :class="[form.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200']">
              <input type="radio" v-model="form.priority" value="medium" class="sr-only">
              <div class="flex w-full items-center justify-between p-4">
                <div class="flex items-center">
                  <div class="text-sm">
                    <p class="font-medium text-gray-900">Sedang</p>
                    <p class="text-gray-500">Normal</p>
                  </div>
                </div>
                <div class="shrink-0 text-yellow-600" v-show="form.priority === 'medium'">
                  <i data-feather="check-circle" class="w-6 h-6"></i>
                </div>
              </div>
            </label>
            <!-- Opsi prioritas tinggi -->
            <label class="relative flex cursor-pointer rounded-lg border"
              :class="[form.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-gray-200']">
              <input type="radio" v-model="form.priority" value="high" class="sr-only">
              <div class="flex w-full items-center justify-between p-4">
                <div class="flex items-center">
                  <div class="text-sm">
                    <p class="font-medium text-gray-900">Tinggi</p>
                    <p class="text-gray-500">Mendesak</p>
                  </div>
                </div>
                <div class="shrink-0 text-red-600" v-show="form.priority === 'high'">
                  <i data-feather="check-circle" class="w-6 h-6"></i>
                </div>
              </div>
            </label>
          </div>
          <!-- Error message untuk prioritas -->
          <div v-if="error?.priority" class="flex items-center mt-2">
            <p class="text-xs text-red-500">{{ error.priority[0] }}</p>
          </div>
        </div>

        <!-- Tombol aksi -->
        <div class="flex justify-end space-x-4">

          <!-- Tombol batal -->
          <RouterLink :to="{ name: 'app.dashboard' }"
            class="px-6 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Batal
          </RouterLink>
          <!-- Tombol submit -->
          <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            :disabled="loading">
            <i data-feather="send" class="w-4 h-4 inline-block mr-2"></i>
            {{ loading ? 'Mengirim...' : 'Kirim Complain' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>