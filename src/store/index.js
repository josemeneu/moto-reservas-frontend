import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    rol: localStorage.getItem('rol') || '',
    busqueda: '', // Búsqueda global de motos

  },
  getters: {
    isLogged: state => !!state.token,
    username: state => {
      if (!state.token) return ''
      try {
        return JSON.parse(atob(state.token.split('.')[1])).sub
      } catch {
        return ''
      }
    },
    rol: state => state.rol,
    busqueda: state => state.busqueda,

  },
  mutations: {
    setAuth(state, { token, rol }) {
      state.token = token
      state.rol = rol
      localStorage.setItem('token', token)
      localStorage.setItem('rol', rol)
    },

    setBusqueda(state, busqueda) {
      state.busqueda = busqueda
    },
    logout(state) {
      state.token = ''
      state.rol = ''
      state.busqueda = ''

      localStorage.removeItem('token')
      localStorage.removeItem('rol')
    },
  },
  actions: {
    login({ commit }, { token, rol }) {
      commit('setAuth', { token, rol })
    },
    logout({ commit }) {
      commit('logout')
    },
  },
})
