<template>
  <div class="usuarios-admin">
    <h2>Gestión de Usuarios</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuarios" :key="usuario.id">
          <td>{{ usuario.id }}</td>
          <td>{{ usuario.username }}</td>
          <td>{{ usuario.rol }}</td>
          <td>
            <button @click="eliminarUsuario(usuario.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="mensaje" :class="{ exito: exito, error: !exito }">{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const usuarios = ref([]);
const mensaje = ref('');
const exito = ref(false);

async function cargarUsuarios() {
  try {
    const res = await api.get('/usuarios');
    usuarios.value = res.data;
  } catch (e) {
    mensaje.value = 'Error cargando usuarios';
    exito.value = false;
  }
}

async function eliminarUsuario(id) {
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
  try {
    await api.delete(`/usuarios/${id}`);
    mensaje.value = 'Usuario eliminado correctamente';
    exito.value = true;
    await cargarUsuarios();
  } catch (e) {
    mensaje.value = 'Error eliminando usuario';
    exito.value = false;
  }
}

onMounted(cargarUsuarios);
</script>

<style scoped>
.usuarios-admin {
  background: #f8fafc;
  padding: 2rem;
  border-radius: 12px;
  max-width: 700px;
  margin: 2rem auto;
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.07);
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
th, td {
  padding: 0.6rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}
th {
  background: #e0e7ef;
}
button {
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}
button:hover {
  background: #b91c1c;
}
.exito { color: #10b981; }
.error { color: #c00; }
</style>
