<template>
  <nav :class="['navbar', { dark: isDark }]">
    <span v-if="isLogged">Bienvenido, {{ username }} ({{ rol }})</span>
    <router-link to="/dashboard" @click.prevent="goDashboard">Inicio</router-link>
    <router-link v-if="isLogged" to="/mis-reservas">Mis reservas</router-link>

    <router-link v-if="rol === 'SUPERADMIN'" to="/admin/usuarios">Gestión de usuarios</router-link>
    <button v-if="isLogged" @click="logout">Cerrar sesión</button>
    <router-link v-else to="/login">Login</router-link>

    <button class="dark-toggle" @click="toggleDark">{{ isDark ? '🌙' : '☀️' }}</button>
  </nav>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const isLogged = computed(() => store.getters.isLogged)
const username = computed(() => store.getters.username)
const rol = computed(() => store.getters.rol)

const isDark = ref(false)

function toggleDark() {
  isDark.value = !isDark.value
  document.body.classList.toggle('dark', isDark.value)
  localStorage.setItem('darkMode', isDark.value ? '1' : '0')
}
onMounted(() => {
  isDark.value = localStorage.getItem('darkMode') === '1'
  document.body.classList.toggle('dark', isDark.value)
})

function logout() {
  store.dispatch('logout')
  router.push('/login')
}
function goDashboard(e) {
  router.push({ path: '/dashboard' }).then(() => {
    // Forzar recarga si ya estás ahí
    router.go(0);
  });
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: 18px;
  background: #2ecc71;
  color: #fff;
  padding: 12px 24px;
  border-radius: 0 0 12px 12px;
  font-size: 1.1em;
  transition: background 0.2s, color 0.2s;
}


.navbar.dark {
  background: #23272f;
  color: #f1f1f1;
}
.navbar.dark a {
  color: #f1f1f1;
}
nav a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}
button {
  background: #e74c3c;
  border: none;
  color: #fff;
  padding: 7px 18px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
.dark-toggle {
  background: transparent;
  color: inherit;
  border: none;
  font-size: 1.4em;
  padding: 0 10px;
  margin-left: auto;
  cursor: pointer;
}
body.dark {
  background: #181a1b;
  color: #f1f1f1;
}
</style>
