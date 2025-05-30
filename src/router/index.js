import Admin from '@/layouts/Admin.vue'
import Auth from '@/layouts/Auth.vue'
import { useAuthStore } from '@/stores/auth'
import Dashboard from '@/views/admin/Dashboard.vue'
import TicketList from '@/views/admin/ticket/TicketList.vue'
import TicketDetail from '@/views/admin/ticket/TicketDetail.vue'
import Login from '@/views/auth/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from '@/layouts/App.vue'
import AppDashboard from '@/views/app/Dashboard.vue'
import AppTicketDetail from '@/views/app/TicketDetail.vue'
import AppTicketCreate from '@/views/app/TicketCreate.vue'
import Register from '@/views/auth/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          path: '',
          name: 'app.dashboard',
          component: AppDashboard,
          meta: {
            requiresAuth: true,
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
            isAdmin: true
          }
        },
      ],
    },
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


// midleware
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (authStore.token) {
      try {
        if (!authStore.user) {
          await authStore.checkAuth()
        }

        // Tambahkan pengecekan role
        if (to.path.startsWith('/admin') && authStore.user.role !== 'admin') {
          next({ name: 'app.dashboard' })
          return
        }

        next()
      } catch (error) {
        next({ name: 'login' })
      }
    } else {
      next({ name: 'login' })
    }
  } else if (to.meta.requiresUnauth && authStore.token) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
