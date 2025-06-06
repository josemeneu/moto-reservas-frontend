<template>
  <div class="reservas-usuario">
    <h2>Gestión de reservas eliminada</h2>
    <p>La gestión y visualización de reservas ha sido eliminada de este proyecto.</p>
  </div>
</template>

<script setup>
// Componente deshabilitado intencionalmente
</script>

<style scoped>
.reservas-usuario {
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.09);
  text-align: center;
}
</style>

  <div class="reservas-usuario">
    <h2>Mis Reservas</h2>
    <div v-if="reservas.length === 0">No tienes reservas.</div>
    <ul>
      <li v-for="reserva in reservas" :key="reserva.id">
        <b>{{ reserva.moto.nombre }}</b> — {{ reserva.fecha_inicio }} a {{ reserva.fecha_fin }}
        <span v-if="reserva.activa">(Activa)</span>
        <span v-else>(Finalizada)</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const reservas = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/reservas/mis-reservas', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    reservas.value = res.data
  } catch (e) {
    reservas.value = []
  }
})
</script>

<style scoped>
.reservas-usuario {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
ul {
  padding-left: 0;
}
li {
  list-style: none;
  margin-bottom: 12px;
  background: #f7f7f7;
  border-radius: 6px;
  padding: 10px 16px;
}
</style>
