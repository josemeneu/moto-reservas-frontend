<template>
  <div class="login-container">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Usuario" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const store = useStore()

const emit = defineEmits(['login-success'])

async function login() {
  error.value = ''
  try {
    const res = await api.post('/auth/login', { username: username.value, password: password.value })
    const token = res.data.token
    const payload = JSON.parse(atob(token.split('.')[1]))
    store.dispatch('login', { token, rol: payload.rol })
    emit('login-success')
    router.push('/dashboard')
  } catch (err) {
    error.value = 'Credenciales incorrectas'
  }
}
</script>

<style scoped>
.login-container {
  max-width: 350px;
  margin: 60px auto;
  padding: 30px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  text-align: center;
}
input {
  width: 90%;
  margin: 10px 0;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
button {
  width: 100%;
  padding: 10px;
  background: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}
.error {
  color: #e74c3c;
  margin-top: 12px;
}
</style>
