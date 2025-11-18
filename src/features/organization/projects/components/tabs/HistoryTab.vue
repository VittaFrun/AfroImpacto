<template>
  <v-row>
    <v-col cols="12">
      <!-- Header -->
      <v-card class="mb-4 elevation-1" rounded="lg">
        <v-card-text class="pa-4">
          <div class="d-flex align-center justify-space-between flex-wrap gap-3">
            <div>
              <h2 class="text-h6 font-weight-bold mb-1">
                <v-icon class="mr-2" color="primary">mdi-history</v-icon>
                Historial de Eliminaciones
              </h2>
              <p class="text-body-2 text-grey mb-0">
                Registro de todas las eliminaciones realizadas en este proyecto
              </p>
            </div>
            <div class="d-flex gap-2 flex-wrap">
              <v-select
                v-model="filterTipo"
                :items="tiposEntidad"
                label="Filtrar por tipo"
                density="compact"
                variant="outlined"
                hide-details
                style="max-width: 200px"
                clearable
              ></v-select>
              <ModernButton
                color="grey"
                variant="outlined"
                prepend-icon="mdi-refresh"
                @click="loadHistory"
                :loading="loading"
                size="small"
              >
                Actualizar
              </ModernButton>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Lista de eliminaciones -->
    <v-col cols="12">
      <v-card class="elevation-1" rounded="lg">
        <v-card-text class="pa-4">
          <div v-if="loading" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
            <p class="text-body-2 text-grey mt-4">Cargando historial...</p>
          </div>

          <div v-else-if="filteredHistory.length === 0" class="text-center py-12">
            <v-icon size="100" color="grey-lighten-2">mdi-history</v-icon>
            <h3 class="text-h6 text-grey mt-4">No hay eliminaciones registradas</h3>
            <p class="text-body-2 text-grey mb-0">
              El historial de eliminaciones aparecerá aquí cuando se realicen eliminaciones en el proyecto
            </p>
          </div>

          <v-timeline v-else density="compact" align="start" side="end" class="mt-2">
            <v-timeline-item
              v-for="(item, index) in filteredHistory"
              :key="index"
              :dot-color="getTipoColor(item.tipo_entidad)"
              size="small"
              class="mb-4"
            >
              <template v-slot:icon>
                <v-icon :color="getTipoColor(item.tipo_entidad)" size="20">
                  {{ getTipoIcon(item.tipo_entidad) }}
                </v-icon>
              </template>

              <v-card class="elevation-1" rounded="lg">
                <v-card-text class="pa-4">
                  <div class="d-flex align-start justify-space-between flex-wrap gap-2 mb-2">
                    <div class="flex-grow-1">
                      <div class="d-flex align-center gap-2 mb-1">
                        <v-chip
                          :color="getTipoColor(item.tipo_entidad)"
                          size="small"
                          variant="tonal"
                        >
                          {{ getTipoNombre(item.tipo_entidad) }}
                        </v-chip>
                        <span class="text-subtitle-2 font-weight-bold">
                          {{ item.nombre_entidad || 'Entidad eliminada' }}
                        </span>
                      </div>
                      <p class="text-body-2 text-grey mb-2">
                        {{ item.descripcion }}
                      </p>
                    </div>
                    <div class="text-right">
                      <div class="text-caption text-grey mb-1">
                        {{ formatDate(item.fecha_eliminacion) }}
                      </div>
                      <div class="text-caption text-grey">
                        Por: {{ item.usuario_eliminador?.nombre || 'Usuario desconocido' }}
                      </div>
                    </div>
                  </div>

                  <v-divider v-if="item.datos_adicionales" class="my-2"></v-divider>

                  <div v-if="item.datos_adicionales" class="mt-2">
                    <v-expansion-panels variant="accordion" density="compact">
                      <v-expansion-panel>
                        <v-expansion-panel-title>
                          <span class="text-caption">Ver detalles adicionales</span>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <pre class="text-caption">{{ JSON.stringify(item.datos_adicionales, null, 2) }}</pre>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/plugins/axios';
import ModernButton from '@/components/ui/ModernButton.vue';
import { formatDate } from '@/utils/formatters';

const props = defineProps({
  projectId: {
    type: Number,
    required: true
  }
});

const loading = ref(false);
const history = ref([]);
const filterTipo = ref(null);

const tiposEntidad = [
  { title: 'Asignación', value: 'asignacion' },
  { title: 'Tarea', value: 'tarea' },
  { title: 'Fase', value: 'fase' },
  { title: 'Proyecto', value: 'proyecto' },
  { title: 'Voluntario', value: 'voluntario' },
];

const filteredHistory = computed(() => {
  if (!filterTipo.value) {
    return history.value;
  }
  return history.value.filter(item => item.tipo_entidad === filterTipo.value);
});

const getTipoColor = (tipo) => {
  const colors = {
    asignacion: 'info',
    tarea: 'warning',
    fase: 'primary',
    proyecto: 'error',
    voluntario: 'success',
  };
  return colors[tipo] || 'grey';
};

const getTipoIcon = (tipo) => {
  const icons = {
    asignacion: 'mdi-clipboard-account',
    tarea: 'mdi-check-circle',
    fase: 'mdi-folder',
    proyecto: 'mdi-folder-multiple',
    voluntario: 'mdi-account',
  };
  return icons[tipo] || 'mdi-delete';
};

const getTipoNombre = (tipo) => {
  const nombres = {
    asignacion: 'Asignación',
    tarea: 'Tarea',
    fase: 'Fase',
    proyecto: 'Proyecto',
    voluntario: 'Voluntario',
  };
  return nombres[tipo] || tipo;
};

const loadHistory = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/eliminacion-historial/proyecto/${props.projectId}`);
    history.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar historial:', error);
    history.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadHistory();
});
</script>

<style scoped>
.v-timeline-item {
  min-height: 80px;
}
</style>

