import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const rol = ref(localStorage.getItem('rol') || '')

  const isLogged = computed(() => !!token.value)
  const username = computed(() => {
    if (!token.value) return ''
    try {
      return JSON.parse(atob(token.value.split('.')[1])).sub
    } catch {
      return ''
    }
  })

  function login(newToken, newRol) {
    token.value = newToken
    rol.value = newRol
    localStorage.setItem('token', newToken)
    localStorage.setItem('rol', newRol)
  }

  function logout() {
    token.value = ''
    rol.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
  }

  return { token, rol, isLogged, username, login, logout }
})
