import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import Login from '../components/Login.vue'
import MisReservas from '../components/MisReservas.vue'
import ReservasAdmin from '../components/ReservasAdmin.vue'
import Register from '../components/Register.vue'
import LoginRegisterWrapper from '../components/LoginRegisterWrapper.vue'

const routes = [
  { path: '/', redirect: '/auth' },
  { path: '/auth', component: LoginRegisterWrapper },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/login', component: Login }, // fallback
  { path: '/register', component: Register }, // fallback
  { path: '/mis-reservas', component: MisReservas, meta: { requiresAuth: true } },
  { path: '/admin/reservas', component: ReservasAdmin, meta: { requiresAuth: true, adminOnly: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const rol = localStorage.getItem('rol')
  if (to.meta.requiresAuth && !token) {
    next('/auth')
  } else if ((to.path === '/auth' || to.path === '/login' || to.path === '/register') && token) {
    next('/dashboard')
  } else if (to.meta.adminOnly && rol !== 'SUPERADMIN') {
    next('/')
  } else {
    next()
  }
})

export default router
