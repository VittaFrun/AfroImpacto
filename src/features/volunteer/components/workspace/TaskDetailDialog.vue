<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Detalle de Tarea"
    icon="mdi-format-list-checks"
    icon-color="primary"
    max-width="700px"
  >
    <template #content>
      <div v-if="task" class="task-detail-content">
        <!-- Header Info -->
        <div class="mb-4">
          <div class="d-flex align-center gap-2 mb-3">
            <v-chip
              :color="getPriorityColor(task.prioridad)"
              size="small"
              variant="tonal"
            >
              {{ task.prioridad || 'Media' }}
            </v-chip>
            <v-chip
              :color="getStatusColor(task.estado?.id_estado || task.id_estado)"
              size="small"
              variant="tonal"
            >
              {{ task.estado?.nombre || 'Pendiente' }}
            </v-chip>
            <v-chip
              v-if="task.fase"
              color="info"
              size="small"
              variant="tonal"
            >
              {{ task.fase.nombre }}
            </v-chip>
          </div>
          <h3 class="text-h5 font-weight-bold mb-2">{{ task.descripcion || 'Tarea sin descripción' }}</h3>
        </div>

        <!-- Task Info Grid -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <div class="info-row mb-3">
              <v-icon size="18" color="grey" class="mr-2">mdi-calendar-start</v-icon>
              <div>
                <div class="text-caption text-grey">Fecha de Inicio</div>
                <div class="text-body-2 font-weight-medium">
                  {{ task.fecha_inicio ? formatDate(task.fecha_inicio) : 'No definida' }}
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="info-row mb-3">
              <v-icon size="18" color="grey" class="mr-2">mdi-calendar-end</v-icon>
              <div>
                <div class="text-caption text-grey">Fecha de Vencimiento</div>
                <div class="text-body-2 font-weight-medium">
                  {{ task.fecha_fin ? formatDate(task.fecha_fin) : 'No definida' }}
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="info-row mb-3">
              <v-icon size="18" color="grey" class="mr-2">mdi-account-tie</v-icon>
              <div>
                <div class="text-caption text-grey">Rol Asignado</div>
                <div class="text-body-2 font-weight-medium">
                  {{ task.rol?.nombre || 'No especificado' }}
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="info-row mb-3">
              <v-icon size="18" color="grey" class="mr-2">mdi-puzzle</v-icon>
              <div>
                <div class="text-caption text-grey">Complejidad</div>
                <div class="text-body-2 font-weight-medium">
                  {{ task.complejidad || 'Media' }}
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Comments Section -->
        <div class="mb-4">
          <h4 class="text-subtitle-1 font-weight-bold mb-3">Comentarios</h4>
          <CommentThread
            :tipo-entidad="'tarea'"
            :id-entidad="task.id_tarea"
            :auto-load="true"
            :show-form="true"
          />
        </div>
      </div>
    </template>
    <template #actions>
      <v-btn
        color="grey"
        variant="outlined"
        @click="$emit('update:modelValue', false)"
      >
        Cerrar
      </v-btn>
      <v-btn
        v-if="task && canUpdateStatus"
        color="primary"
        variant="flat"
        @click="updateStatus"
        :loading="updatingStatus"
      >
        Actualizar Estado
      </v-btn>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import { formatDate } from '@/utils/formatters';
import CommentThread from '@/features/comments/components/CommentThread.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  },
  updatingStatus: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'update-status', 'add-comment']);

// Comentarios ahora se manejan con CommentThread

const canUpdateStatus = computed(() => {
  if (!props.task) return false;
  const estadoId = props.task.estado?.id_estado || props.task.id_estado;
  return estadoId !== 3; // No completado
});

const getPriorityColor = (prioridad) => {
  const colorMap = {
    'Alta': 'error',
    'Media': 'warning',
    'Baja': 'info'
  };
  return colorMap[prioridad] || 'grey';
};

const getStatusColor = (estadoId) => {
  if (!estadoId) return 'grey';
  const colorMap = {
    1: 'success',
    2: 'info',
    3: 'success',
    4: 'warning',
    5: 'error'
  };
  return colorMap[estadoId] || 'grey';
};

// Comentarios ahora se manejan con CommentThread

const updateStatus = () => {
  emit('update-status', props.task.id_tarea);
};
</script>

<style scoped>
.task-detail-content {
  padding: 8px;
}

.info-row {
  display: flex;
  align-items: flex-start;
}

.comment-item {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

