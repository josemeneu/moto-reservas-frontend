<template>
  <div class="mis-reservas-container">
    <h2>Mis reservas</h2>
    <div v-if="reservas.length === 0">No tienes reservas activas.</div>
    <div v-else>
      <div v-for="reserva in reservas" :key="reserva.id" class="reserva-card">
        <h3>{{ reserva.moto.nombre }}</h3>
        <img :src="reserva.moto.imagen" alt="Imagen moto" class="moto-img" />
        <p><strong>Desde:</strong> {{ formatFecha(reserva.fecha_inicio) }}</p>
        <p><strong>Hasta:</strong> {{ formatFecha(reserva.fecha_fin) }}</p>
        <p><strong>Estado:</strong> <span :class="{ activa: reserva.activa, inactiva: !reserva.activa }">{{ reserva.activa ? 'Activa' : 'Finalizada' }}</span></p>
        <button @click="eliminarReserva(reserva.id)">Eliminar</button>
      </div>
      <div v-if="mensaje" :class="{ exito: exito, error: !exito }" style="margin-top:1em;">{{ mensaje }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import api from '../api'
import dayjs from 'dayjs'

function formatFecha(fecha) {
  if (!fecha) return '';
  return dayjs(fecha).format('DD/MM/YYYY');
}

const reservas = ref([])
const mensaje = ref('')
const exito = ref(false)

async function eliminarReserva(id) {
  if (!confirm('¿Seguro que quieres eliminar esta reserva?')) return;
  mensaje.value = '';
  exito.value = false;
  try {
    await api.delete(`/reservas/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    mensaje.value = 'Reserva eliminada correctamente.';
    exito.value = true;
    await cargarReservas();
  } catch (e) {
    mensaje.value = e.response?.data?.message || e.response?.data || e.message || 'Error al eliminar reserva';
    exito.value = false;
  }
}

async function cargarReservas() {
  try {
    const res = await api.get('/reservas/mis-reservas', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    reservas.value = res.data;
  } catch (err) {
    reservas.value = [];
  }
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
.mis-reservas-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.09);
  color: #111;
}
body.dark .mis-reservas-container {
  background: #d1d5db !important; /* gris claro para buen contraste */
  color: #111 !important;
}
.reserva-card {
  border: 1px solid #e0e7ef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  background: #f8fafc;
  color: #111;
  display: flex;
  align-items: center;
  gap: 22px;
}
body.dark .reserva-card {
  background: #e5e7eb !important; /* gris más oscuro */
  color: #111 !important;
}
.moto-img {
  width: 110px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 1px 8px #dbeafe;
}
.activa { color: #10b981; font-weight: bold; }
.inactiva { color: #e74c3c; font-weight: bold; }
</style>
