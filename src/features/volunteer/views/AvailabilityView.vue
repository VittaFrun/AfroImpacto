<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h4 font-weight-bold text-primary mb-4">Mi Disponibilidad</h1>
    <p class="text-body-1 text-grey-darken-1 mb-6">
      Define tus horarios para que las organizaciones sepan cuándo pueden contar contigo.
    </p>

    <v-card class="pa-6 rounded-lg elevation-0">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">Horarios Disponibles</span>
        <v-btn color="primary" variant="flat" @click="dialog = true">
          <v-icon start>mdi-plus</v-icon>
          Añadir Horario
        </v-btn>
      </v-card-title>
      <v-divider class="my-4"></v-divider>
      <v-list lines="one">
        <v-list-item v-for="(item, i) in availability" :key="i">
          <v-list-item-title class="font-weight-bold">{{ item.dia_semana }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.hora_inicio }} - {{ item.hora_fin }}</v-list-item-subtitle>
          <template v-slot:append>
            <v-btn icon="mdi-pencil" variant="text" color="warning" size="small" @click="editItem(item)"></v-btn>
            <v-btn icon="mdi-delete" variant="text" color="error" size="small" @click="deleteItem(i)"></v-btn>
          </template>
        </v-list-item>
        <v-card-text v-if="availability.length === 0" class="text-center grey--text">
          No has definido tu disponibilidad.
        </v-card-text>
      </v-list>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedIndex === -1 ? 'Añadir' : 'Editar' }} Horario</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.dia_semana"
                  :items="['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']"
                  label="Día de la semana"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.hora_inicio" label="Hora de inicio" type="time" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.hora_fin" label="Hora de fin" type="time" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close">Cancelar</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const dialog = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
  dia_semana: '',
  hora_inicio: '',
  hora_fin: ''
});
const defaultItem = ref({
  dia_semana: '',
  hora_inicio: '',
  hora_fin: ''
});

const availability = ref([
  { dia_semana: 'Lunes', hora_inicio: '09:00', hora_fin: '12:00' },
  { dia_semana: 'Miércoles', hora_inicio: '14:00', hora_fin: '18:00' },
  { dia_semana: 'Sábado', hora_inicio: '08:00', hora_fin: '16:00' },
]);

function editItem(item) {
  editedIndex.value = availability.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}

function deleteItem(index) {
  if (confirm('¿Estás seguro de que quieres eliminar este horario?')) {
    availability.value.splice(index, 1);
  }
}

function close() {
  dialog.value = false;
  editedItem.value = Object.assign({}, defaultItem.value);
  editedIndex.value = -1;
}

function save() {
  if (editedIndex.value > -1) {
    Object.assign(availability.value[editedIndex.value], editedItem.value);
  } else {
    availability.value.push(editedItem.value);
  }
  close();
}
</script>
