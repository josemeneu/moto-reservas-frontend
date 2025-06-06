<template>
  <div class="reservas-admin">
    <h2>Gestión de Reservas (Superadmin)</h2>
    <div v-if="reservas.length === 0">No hay reservas.</div>
    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Moto</th>
          <th>Usuario</th>
          <th>Fechas</th>
          <th>Estado</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reserva in reservas" :key="reserva.id">
          <td>{{ reserva.id }}</td>
          <td>{{ reserva.moto.nombre }}</td>
          <td>{{ reserva.usuario.username }}</td>
          <td>{{ reserva.fechaInicio }} a {{ reserva.fechaFin }}</td>
          <td>
            <span v-if="reserva.activa">Activa</span>
            <span v-else>Finalizada</span>
          </td>
          <td>
            <button v-if="reserva.activa" @click="cambiarEstado(reserva.id, false)">Finalizar</button>
            <button v-else @click="cambiarEstado(reserva.id, true)">Activar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const reservas = ref([])

async function cargarReservas() {
  const res = await api.get('/reservas')
  reservas.value = res.data
}

async function cambiarEstado(id, activa) {
  await api.put(`/reservas/${id}/estado`, { activa })
  await cargarReservas()
}

onMounted(() => {
  cargarReservas();
  window.addEventListener('reserva-creada', cargarReservas);
});

onUnmounted(() => {
  window.removeEventListener('reserva-creada', cargarReservas);
});
</script>

<style scoped>
.reservas-admin {
  max-width: 900px;
  margin: 40px auto;
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
th {
  background: #2ecc71;
  color: #fff;
}
button {
  background: #e67e22;
  border: none;
  color: #fff;
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
</style>
