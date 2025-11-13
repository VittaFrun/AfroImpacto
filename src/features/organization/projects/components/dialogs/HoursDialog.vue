<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Horas Voluntariadas"
    icon="mdi-clock-check"
    max-width="1000px"
  >
    <template #content>
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else-if="volunteerHours.length === 0" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-clock-outline</v-icon>
        <p class="text-grey mt-4">No hay horas registradas</p>
      </div>
      <div v-else>
        <v-table>
          <thead>
            <tr>
              <th>Voluntario</th>
              <th>Fecha</th>
              <th>Horas</th>
              <th>Tarea</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hora in volunteerHours" :key="hora.id_horas">
              <td>{{ hora.voluntario?.usuario?.nombre || hora.voluntario?.nombre || 'Voluntario' }}</td>
              <td>{{ formatDate(hora.fecha) }}</td>
              <td>{{ hora.horas_trabajadas }}h</td>
              <td>{{ hora.tarea?.descripcion?.substring(0, 30) || 'N/A' }}</td>
              <td>{{ hora.descripcion?.substring(0, 50) || '-' }}</td>
              <td>
                <v-chip
                  :color="hora.verificada ? 'success' : 'warning'"
                  size="small"
                  variant="tonal"
                >
                  {{ hora.verificada ? 'Verificada' : 'Pendiente' }}
                </v-chip>
              </td>
              <td>
                <v-btn
                  v-if="!hora.verificada"
                  icon="mdi-check"
                  color="success"
                  size="small"
                  variant="text"
                  @click="$emit('verify-hours', hora.id_horas)"
                  :loading="verifyingHours === hora.id_horas"
                ></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </template>
    <template #actions>
      <ModernButton
        color="grey"
        variant="outlined"
        @click="$emit('update:modelValue', false)"
      >
        Cerrar
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  volunteerHours: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  verifyingHours: {
    type: [Number, String],
    default: null
  },
  formatDate: {
    type: Function,
    required: true
  }
});

defineEmits(['update:modelValue', 'verify-hours']);
</script>

