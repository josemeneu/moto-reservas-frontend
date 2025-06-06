<template>
  <div class="auth-wrapper">
    <component :is="currentComponent" @go-login="showLogin = true" @go-register="showLogin = false" @login-success="onLoginSuccess" />
    <div class="toggle-links">
      <button v-if="!showLogin" @click="showLogin = true">¿Ya tienes cuenta? Inicia sesión</button>
      <button v-else @click="showLogin = false">¿No tienes cuenta? Regístrate</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Login from './Login.vue'
import Register from './Register.vue'
import { useRouter } from 'vue-router'

const showLogin = ref(true)
const router = useRouter()

const currentComponent = computed(() => showLogin.value ? Login : Register)

function onLoginSuccess() {
  router.push('/dashboard')
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #f4f6f8 0%, #e9ecef 100%);
}
.toggle-links {
  margin-top: 14px;
  text-align: center;
}
.toggle-links button {
  background: none;
  color: #0ea5e9;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1rem;
}
</style>
