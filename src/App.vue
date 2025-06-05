<!--
  File: App.vue
  Deskripsi: Komponen utama aplikasi yang berfungsi sebagai container
  Fungsi: Menampilkan komponen yang sesuai dengan route yang aktif
-->

<script setup>
  // Import komponen RouterLink dan RouterView dari vue-router
  // RouterLink: Komponen untuk navigasi antar halaman
  // RouterView: Komponen yang akan menampilkan halaman sesuai route
  import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <!-- RouterView akan menampilkan komponen yang sesuai dengan URL saat ini -->
  <!-- Misalnya: jika URL /login, maka akan menampilkan komponen Login.vue -->
  <RouterView />
</template>