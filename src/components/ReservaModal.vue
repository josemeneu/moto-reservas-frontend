<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <button class="close-btn" @click="$emit('close')" aria-label="Cerrar">&times;</button>
      <h2>Reserva para {{ moto.nombre }}</h2>
      <img :src="moto.imagen" alt="Imagen moto" />
      <p>{{ moto.descripcion }}</p>
      <div class="calendario">
  <DatePicker
    v-model.range="rango"
    :columns="1"
    :min-date="new Date()"
    color="green"
    is-range
    title="Selecciona las fechas de reserva"
    :attributes="[{ highlight: true, content: 'Reserva', dates: [rango.start, rango.end] }]"
    class="custom-calendar"
  />
</div>
<div v-if="rango.start && rango.end" class="resumen">
  <p>Reserva desde <b>{{ formatFecha(rango.start) }}</b> hasta <b>{{ formatFecha(rango.end) }}</b></p>
  <p v-if="dias > 0">Total días: {{ dias }}</p>
  <p v-if="dias > 0">Precio total: {{ dias * precioDia }} € <span v-if="precioDia">( {{ precioDia }} €/día )</span></p>
</div>
<div v-if="error" class="error" style="color:#e11d48; text-align:center; margin-bottom:0.5rem">{{ error }}</div>
<div v-if="exito" class="exito" style="color:#10b981; text-align:center; margin-bottom:0.5rem">{{ exito }}</div>
<button :disabled="!puedeReservar" @click="reservar">Reservar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import api from '../api';
import dayjs from 'dayjs';

function formatFecha(date) {
  if (!date) return '';
  return dayjs(date).format('DD/MM/YYYY');
}

const props = defineProps({
  moto: Object,
  visible: Boolean
});
const error = ref(''); // Muestra errores del backend
const rango = ref({ start: null, end: null });
const precioDia = computed(() => props.moto && props.moto.precio ? Number(props.moto.precio) : 0); // Precio dinámico por moto

const dias = computed(() => {
  if (rango.value.start && rango.value.end) {
    const d1 = new Date(rango.value.start);
    const d2 = new Date(rango.value.end);
    const diff = (d2 - d1) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? diff : 0;
  }
  return 0;
});

const puedeReservar = computed(() => {
  return rango.value.start && rango.value.end && dias.value > 0;
});

const exito = ref('');

async function reservar() {
  error.value = '';
  exito.value = '';
  try {
    await api.post('/reservas', {
      motoId: props.moto.id,
      fechaInicio: dayjs(rango.value.start).format('YYYY-MM-DD'),
      fechaFin: dayjs(rango.value.end).format('YYYY-MM-DD')
      // NO enviar 'id' al backend
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    exito.value = '¡Reserva realizada con éxito!';
    // Notificar a otras vistas que recarguen reservas (evento global simple)
    window.dispatchEvent(new Event('reserva-creada'));
    setTimeout(() => {
      rango.value = { start: null, end: null };
      exito.value = '';
      emit('close');
    }, 1200);
  } catch (e) {
    error.value = e.response?.data?.message || e.response?.data || e.message || 'Error al crear reserva';
  }
}

const emit = defineEmits(['close']);

watch(() => props.visible, (val) => {
  if (!val) {
    rango.value = { start: null, end: null };
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30,41,59,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: background 0.25s;
}
body.dark .modal-overlay {
  background: rgba(24,26,27,0.72);
}

.modal {
  background: linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  border-radius: 24px;
  min-width: 430px;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background 0.25s, color 0.25s;
}
body.dark .modal {
  background: linear-gradient(135deg, #23272f 60%, #23272f 100%);
  color: #f1f1f1;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  width: 60px;
  height: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  cursor: pointer;
  color: #64748b;
  border-radius: 6px;
  box-shadow: none;
  transition: color 0.18s, background 0.18s;
  z-index: 10;
  padding: 0;
}
.close-btn:hover {
  color: #e11d48;
  background: #f1f5f9;
}

.close-btn:hover {
  color: #e11d48;
  background: none;
}
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #64748b;
  transition: color 0.18s;
}
.close-btn:hover {
  color: #e11d48;
}
.modal img {
  width: 100%;
  max-width: 400px;
  height: 180px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 14px #dbeafe;
}
.modal h2 {
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  text-align: center;
  transition: color 0.18s;
}
body.dark .modal h2 {
  color: #e0e7ef;
}

.modal p {
  color: #475569;
  margin: 0.2rem 0;
  text-align: center;
  transition: color 0.18s;
}
body.dark .modal p {
  color: #b9c2d0;
}

.calendario {
  width: 100%;
  margin: 1.2rem 0 0.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.custom-calendar {
  --vc-accent-600: #10b981;
  --vc-accent-400: #a7f3d0;
  --vc-accent-200: #d1fae5;
  border-radius: 12px;
  box-shadow: 0 2px 12px #dbeafe;
  padding: 0.5rem;
  background: #fff;
}
.resumen {
  margin: 1rem 0;
  background: #f1f5f9;
  padding: 0.75rem 1.2rem;
  border-radius: 8px;
  color: #334155;
  font-weight: 500;
  width: 100%;
  text-align: center;
  transition: background 0.18s, color 0.18s;
}
body.dark .resumen {
  background: #23272f;
  color: #f1f1f1;
}

button {
  margin-top: 1rem;
  background: linear-gradient(90deg, #10b981 60%, #22d3ee 100%);
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 2.2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 8px #bae6fd;
}
button:hover:enabled {
  background: linear-gradient(90deg, #22d3ee 60%, #10b981 100%);
}
button[disabled] {
  opacity: 0.5;
  pointer-events: none;
}
@media (max-width: 600px) {
  .modal {
    min-width: 95vw;
    max-width: 99vw;
    padding: 1rem 0.2rem;
  }
  .modal img {
    height: 90px;
  }
}
</style>
