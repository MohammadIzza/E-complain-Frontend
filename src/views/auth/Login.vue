<!--
  File: views/auth/Login.vue
  Deskripsi: Komponen halaman login
  Fungsi: Menampilkan form login dan menangani proses autentikasi
-->

<script setup>
// Import library yang dibutuhkan
import { ref, onMounted } from 'vue'  // Vue Composition API
import { useAuthStore } from '@/stores/auth'  // Store untuk autentikasi
import { storeToRefs } from 'pinia'  // Helper untuk reactive store
import feather from 'feather-icons'  // Library untuk icon

// Inisialisasi store autentikasi
const authStore = useAuthStore()
// Destructure state dari store (membuat reactive)
const { loading, error } = storeToRefs(authStore)
// Destructure action dari store
const { login } = authStore

// State untuk form login
const form = ref({
  email: '',
  password: ''
})

// State untuk toggle visibility password
const showPassword = ref(false)
// Fungsi untuk toggle visibility password
const togglePassword = () => {
  showPassword.value = !showPassword.value
  feather.replace()  // Update icon feather
}

// Handler untuk submit form
const handleSubmit = async () => {
  await login(form.value)  // Panggil action login dari store
}

// Lifecycle hook: dijalankan setelah komponen di-mount
onMounted(() => {
  feather.replace()  // Inisialisasi icon feather
})
</script>

<template>
  <!-- Form login dengan event submit -->
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <!-- Input email -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <div class="mt-1 relative">
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
          v-model="form.email"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="nama@perusahaan.com">
        <!-- Icon email -->
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <i data-feather="mail" class="w-4 h-4 text-gray-400"></i>
        </div>
      </div>
      <!-- Error message untuk email -->
      <div v-if="error?.email" class="flex items-center mt-2">
        <p class="text-xs text-red-500">{{ error.email[0] }}</p>
      </div>
    </div>

    <!-- Input password -->
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <div class="mt-1 relative">
        <input 
          :type="showPassword ? 'text' : 'password'" 
          id="password" 
          name="password" 
          required 
          v-model="form.password"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="••••••••">
        <!-- Toggle password visibility -->
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button type="button" class="text-gray-400 hover:text-gray-600 focus:outline-none" @click="togglePassword">
            <i :data-feather="showPassword ? 'eye-off' : 'eye'" class="w-4 h-4" id="password-toggle"></i>
          </button>
        </div>
      </div>
      <!-- Error message untuk password -->
      <div v-if="error?.password" class="flex items-center mt-2">
        <p class="text-xs text-red-500">{{ error.password[0] }}</p>
      </div>
    </div>

    <!-- Remember me dan forgot password -->
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input type="checkbox" id="remember" name="remember"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
        <label for="remember" class="ml-2 block text-sm text-gray-700">Ingat saya</label>
      </div>
      <a href="#" class="text-sm text-blue-600 hover:text-blue-800">Lupa password?</a>
    </div>

    <!-- Tombol submit -->
    <div>
      <button type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        :disabled="loading">
        {{ loading ? 'Memproses...' : 'Masuk' }}
      </button>
    </div>
    <!-- Error message umum -->
    <div v-if="error?.message" class="flex items-center mt-2">
      <p class="text-xs text-red-500">{{ error.message }}</p>
    </div>
  </form>

  <!-- Divider -->
  <div class="mt-6">
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-200"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">Atau</span>
      </div>
    </div>
  </div>

  <!-- Link ke halaman register -->
  <div class="mt-6 text-center">
    <p class="text-sm text-gray-600">
      Belum punya akun?
      <RouterLink :to="{ name: 'register' }" class="font-medium text-blue-600 hover:text-blue-800">Daftar
        sekarang</RouterLink>
    </p>
  </div>
</template>