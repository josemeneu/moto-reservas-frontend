<template>
  <div class="register-container">
    <h2>Crear cuenta</h2>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="Usuario" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <!-- Solo usuario normal, sin opción de superadmin -->
      <input type="hidden" v-model="rol" />
      <button type="submit">Registrarse</button>
      <div v-if="mensaje" :class="{ exito: exito, error: !exito }">{{ mensaje }}</div>
    </form>
    <button class="login-link" @click="$emit('go-login')">¿Ya tienes cuenta? Inicia sesión</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api'

const username = ref('')
const password = ref('')
const rol = ref('USER')
const mensaje = ref('')
const exito = ref(false)

async function register() {
  mensaje.value = ''
  try {
    await api.post('/auth/register', { username: username.value, password: password.value, rol: rol.value })
    mensaje.value = 'Usuario creado correctamente. Ahora puedes iniciar sesión.'
    exito.value = true
    username.value = ''
    password.value = ''
    rol.value = 'USER'
  } catch (err) {
    mensaje.value = 'Error: ' + (err.response?.data || err.message)
    exito.value = false
  }
}
</script>

<style scoped>
.register-container {
  max-width: 350px;
  margin: 60px auto;
  padding: 30px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  text-align: center;
}
input, select {
  width: 90%;
  margin: 10px 0;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
button {
  width: 100%;
  padding: 10px;
  background: #0ea5e9;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}
.login-link {
  background: none;
  color: #0ea5e9;
  text-decoration: underline;
  margin-top: 16px;
  width: auto;
  padding: 0;
  border: none;
  cursor: pointer;
}
.exito { color: #10b981; }
.error { color: #e74c3c; }
</style>
