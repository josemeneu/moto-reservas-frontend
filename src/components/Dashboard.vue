<template>
  <div class="dashboard">
    <img :src="logoActual" alt="VALRIDE Logo" class="dashboard-logo" />
    <div class="buscador-motos">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar motos por nombre, descripción o precio..."
        class="input-busqueda"
      />
    </div>
    <button v-if="rol === 'SUPERADMIN'" class="btn-admin" @click="mostrarUsuarios = !mostrarUsuarios">
      {{ mostrarUsuarios ? 'Ocultar gestión de usuarios' : 'Gestionar usuarios' }}
    </button>
    <UsuariosAdmin v-if="rol === 'SUPERADMIN' && mostrarUsuarios" />
    <div class="motos-grid">
      <div
        v-for="moto in motosFiltradas"
        :key="moto.id"
        class="moto-card"
        :class="{ alquilada: moto.alquilada }"
        @click="abrirReserva(moto)"
      >
        <img :src="moto.imagen" alt="Imagen moto" />
        <h2>{{ moto.nombre }}</h2>
        <p>{{ moto.descripcion }}</p>
        <p class="precio-moto"><b>{{ moto.precio }} €</b> /día</p>
        <p v-if="moto.alquilada" class="alquilada-text">Alquilada</p>
        <p v-else class="disponible-text">Disponible</p>
      </div>
    </div>
    <ReservaModal
      v-if="motoSeleccionada"
      :moto="motoSeleccionada"
      :visible="mostrarModal"
      @close="cerrarReserva"
    />
  </div>
</template>

<script setup>
import logo from '../assets/logo.png';
import logo2 from '../assets/logo2.png';
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import ReservaModal from './ReservaModal.vue';
import UsuariosAdmin from './UsuariosAdmin.vue';
import api from '../api';
const store = useStore();

// Detecta modo oscuro por clase en el body o media query
const isDark = ref(document.body.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches)

onMounted(() => {
  const observer = new MutationObserver(() => {
    isDark.value = document.body.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', e => {
    isDark.value = document.body.classList.contains('dark') || e.matches
  })
})

const logoActual = computed(() => isDark.value ? logo2 : logo)



const mostrarUsuarios = ref(false);

const motos = ref([]);
const busqueda = ref('');

const motosFiltradas = computed(() => {
  if (!busqueda.value.trim()) return motos.value;
  const texto = busqueda.value.toLowerCase();
  return motos.value.filter(moto =>
    (moto.nombre && moto.nombre.toLowerCase().includes(texto)) ||
    (moto.descripcion && moto.descripcion.toLowerCase().includes(texto)) ||
    (moto.precio && moto.precio.toString().includes(texto))
  );
});
const isLogged = computed(() => store.getters.isLogged);
const rol = computed(() => store.getters.rol);

const mostrarModal = ref(false);
const motoSeleccionada = ref(null);

const nuevoUsuario = ref({ username: '', password: '', rol: 'USER' });
const mensajeUsuario = ref('');
const exitoUsuario = ref(false);

async function crearUsuario() {
  try {
    await api.post('/auth/register', nuevoUsuario.value);
    mensajeUsuario.value = 'Usuario creado correctamente';
    exitoUsuario.value = true;
    nuevoUsuario.value = { username: '', password: '', rol: 'USER' };
  } catch (e) {
    mensajeUsuario.value = 'Error creando usuario: ' + (e.response?.data || e.message);
    exitoUsuario.value = false;
  }
}

onMounted(async () => {
  const res = await api.get('/motos');
  motos.value = res.data;
});
function abrirReserva(moto) {
  if (!moto.alquilada) {
    motoSeleccionada.value = moto;
    mostrarModal.value = true;
  }
}

function cerrarReserva() {
  mostrarModal.value = false;
  motoSeleccionada.value = null;
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  transition: background 0.2s, color 0.2s;
}
.buscador-motos {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}
.input-busqueda {
  width: 100%;
  max-width: 420px;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 1.05rem;
  outline: none;
  transition: border 0.2s;
  box-shadow: 0 2px 8px #f1f5f9;
}
.input-busqueda:focus {
  border: 1.5px solid #0ea5e9;
}
.dashboard-logo {
  display: block;
  margin: 0 auto 1.5rem auto;
  max-width: 480px;
  width: 100%;
  height: auto;
  object-fit: contain;
}
body.dark .dashboard {
  background: rgba(35,39,47,0.92);
  color: #f1f1f1;
}

.btn-admin {
  background: #0ea5e9;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 1.5rem;
  transition: background 0.2s;
}
.btn-admin:hover {
  background: #0369a1;
}

.crear-usuario-form {
  background: #f1f5f9;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  max-width: 400px;
}
.crear-usuario-form form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.crear-usuario-form input,
.crear-usuario-form select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}
.crear-usuario-form button {
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.6rem;
  cursor: pointer;
  font-weight: bold;
}
.crear-usuario-form .exito { color: #10b981; }
.crear-usuario-form .error { color: #c00; }
.motos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  justify-items: center;
}

.moto-card {
  max-width: 350px;
  width: 100%;
}
.moto-card {
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%);
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.09);
  padding: 1.5rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.18s, box-shadow 0.18s, background 0.22s, color 0.22s;
  position: relative;
  min-width: 0;
}
body.dark .moto-card {
  background: linear-gradient(135deg, #23272f 60%, #23272f 100%);
  color: #f1f1f1;
  box-shadow: 0 4px 32px 0 rgba(0,0,0,0.19);
}

.moto-card:hover {
  transform: translateY(-8px) scale(1.04);
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13);
}
.moto-card img {
  width: 100%;
  height: 170px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 12px #dbeafe;
}
.moto-card h2 {
  font-size: 1.25rem;
  margin: 0.5rem 0 0.15rem 0;
  color: #1e293b;
  transition: color 0.18s;
}
body.dark .moto-card h2 {
  color: #e0e7ef;
}

.moto-card p {
  color: #64748b;
  margin: 0.2rem 0;
  text-align: center;
  transition: color 0.18s;
}
body.dark .moto-card p {
  color: #b9c2d0;
}

.alquilada {
  opacity: 0.6;
  pointer-events: none;
}
.alquilada-text {
  color: #c00;
  font-weight: bold;
  margin-top: 0.5rem;
}
.disponible-text {
  color: #10b981;
  font-weight: bold;
  margin-top: 0.5rem;
}
@media (max-width: 900px) {
  .motos-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  .moto-card {
    max-width: 98vw;
  }
}

@media (max-width: 600px) {
  .dashboard {
    padding: 0.5rem;
  }
  .motos-grid {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }
  .moto-card {
    padding: 1rem 0.5rem 0.5rem 0.5rem;
    max-width: 100vw;
  }
  .moto-card img {
    height: 120px;
  }
}
</style>
