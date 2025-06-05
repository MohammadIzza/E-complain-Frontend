/**
 * File: router/index.js
 * Deskripsi: Konfigurasi routing untuk aplikasi
 * Fungsi: Mengatur navigasi dan akses ke halaman-halaman dalam aplikasi
 */

// Import layout components
import Admin from '@/layouts/Admin.vue'      // Layout untuk halaman admin
import Auth from '@/layouts/Auth.vue'        // Layout untuk halaman autentikasi
import App from '@/layouts/App.vue'          // Layout untuk halaman user biasa

// Import store untuk autentikasi
import { useAuthStore } from '@/stores/auth'

// Import komponen-komponen halaman
import Dashboard from '@/views/admin/Dashboard.vue'
import TicketList from '@/views/admin/ticket/TicketList.vue'
import TicketDetail from '@/views/admin/ticket/TicketDetail.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import AppDashboard from '@/views/app/Dashboard.vue'
import AppTicketDetail from '@/views/app/TicketDetail.vue'
import AppTicketCreate from '@/views/app/TicketCreate.vue'

// Import fungsi router dari vue-router
import { createRouter, createWebHistory } from 'vue-router'

// Membuat instance router
const router = createRouter({
  // Menggunakan mode history untuk URL yang bersih (tanpa #)
  history: createWebHistory(import.meta.env.BASE_URL),
  
  // Konfigurasi routes
  routes: [
    // Route untuk user biasa
    {
      path: '/',
      component: App,
      children: [
        {
          path: '',
          name: 'app.dashboard',
          component: AppDashboard,
          meta: {
            requiresAuth: true,    // Halaman membutuhkan autentikasi
            title: 'Dashboard',
          },
        },
        {
          path: 'complain/:code',
          name: 'app.complain.detail',
          component: AppTicketDetail,
          meta: {
            requiresAuth: true,
            title: 'Complain Detail',
          },
        },
        {
          path: 'complain/create',
          name: 'app.complain.create',
          component: AppTicketCreate,
        },
      ],
    },
    // Route untuk admin
    {
      path: '/admin',
      component: Admin,
      children: [
        {
          path: 'dashboard',
          name: 'admin.dashboard',
          component: Dashboard,
          meta: {
            requiresAuth: true,
            title: 'Dashboard',
          },
        },
        {
          path: 'complain',
          name: 'admin.complain',
          component: TicketList,
          meta: {
            requiresAuth: true,
            title: 'Complain List',
          },
        },
        {
          path: '/admin/complain/:code',
          name: 'admin.ticket.detail',
          component: () => import('@/views/admin/ticket/TicketDetail.vue'),
          meta: { 
            requiresAuth: true,
            isAdmin: true        // Hanya admin yang bisa akses
          }
        },
      ],
    },
    // Route untuk autentikasi
    {
      path: '/auth',
      component: Auth,
      children: [
        {
          path: 'login',
          name: 'login',
          component: Login,
        },
        {
          path: 'register',
          name: 'register',
          component: Register,
        },
      ],
    },
  ],
})

// Middleware untuk mengecek autentikasi
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Jika halaman membutuhkan autentikasi
  if (to.meta.requiresAuth) {
    if (authStore.token) {
      try {
        // Jika user belum di-load, load dulu
        if (!authStore.user) {
          await authStore.checkAuth()
        }

        // Cek role untuk akses halaman admin
        if (to.path.startsWith('/admin') && authStore.user.role !== 'admin') {
          next({ name: 'app.dashboard' })
          return
        }

        next()
      } catch (error) {
        // Jika error, redirect ke login
        next({ name: 'login' })
      }
    } else {
      // Jika tidak ada token, redirect ke login
      next({ name: 'login' })
    }
  } else if (to.meta.requiresUnauth && authStore.token) {
    // Jika halaman untuk user yang belum login tapi user sudah login
    next({ name: 'dashboard' })
  } else {
    // Jika tidak ada syarat khusus, lanjutkan
    next()
  }
})

export default router
