<template>
  <Navbar />
  <router-view />
</template>

<script setup>
import Navbar from './components/Navbar.vue'
// Si necesitas saber si está logueado, usa Vuex en los componentes hijos
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #f4f6f8;
  color: #222;
  transition: background 0.2s, color 0.2s;
}
#app {
  min-height: 100vh;
  background: linear-gradient(120deg, #f4f6f8 0%, #e9ecef 100%);
  transition: background 0.2s, color 0.2s;
}
body.dark {
  background: #181a1b !important;
  color: #f1f1f1 !important;
}
body.dark #app {
  background: linear-gradient(120deg, #23272f 0%, #181a1b 100%) !important;
  color: #f1f1f1 !important;
}
body.dark a {
  color: #8ecfff !important;
}
body.dark input, body.dark select, body.dark textarea {
  background: #23272f !important;
  color: #f1f1f1 !important;
  border-color: #444 !important;
}
body.dark button {
  background: #3c3f4a !important;
  color: #f1f1f1 !important;
}
</style>
