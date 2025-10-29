<template>
  <div class="kanban-board">
    <div v-for="status in statuses" :key="status.id" class="kanban-column">
      <h3 class="text-subtitle-1 font-weight-bold mb-4">{{ status.name }}</h3>
      <draggable
        v-model="tasksByStatus[status.id]"
        group="tasks"
        item-key="id"
        class="kanban-drag-area"
        @end="onDragEnd"
      >
        <template #item="{ element }">
          <v-card class="kanban-card mb-4" @click="openTaskDetails(element)" :data-id="element.id">
            <v-card-text>
              <p class="font-weight-bold mb-2">{{ element.descripcion }}</p>
              <p class="text-caption text-grey-darken-1 mb-3">Fase: {{ getPhaseName(element.id_fase) }}</p>
              
              <div class="d-flex align-center justify-space-between mt-2">
                <!-- Priority Chip -->
                <v-chip
                  v-if="element.prioridad"
                  :color="priorityConfig(element.prioridad).color"
                  size="small"
                  variant="tonal"
                  class="font-weight-bold"
                >
                  <v-icon start :icon="priorityConfig(element.prioridad).icon"></v-icon>
                  {{ element.prioridad }}
                </v-chip>

                <!-- Complexity Chip -->
                <v-chip
                  v-if="element.complejidad"
                  :color="complexityConfig(element.complejidad).color"
                  size="small"
                  variant="outlined"
                  class="ml-2"
                >
                  {{ element.complejidad }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
  phases: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:taskStatus', 'task-clicked']);

const statuses = [
  { id: 1, name: 'Pendiente' },
  { id: 2, name: 'En Progreso' },
  { id: 3, name: 'Completada' }
];

const tasksByStatus = ref({
  1: [],
  2: [],
  3: [],
});

watch(
  () => props.tasks,
  (newTasks) => {
    if (!newTasks || !Array.isArray(newTasks)) {
      tasksByStatus.value = { 1: [], 2: [], 3: [] };
      return;
    }
    
    tasksByStatus.value = {
      1: newTasks.filter((t) => t.id_estado === 1),
      2: newTasks.filter((t) => t.id_estado === 2),
      3: newTasks.filter((t) => t.id_estado === 3),
    };
  },
  { immediate: true, deep: true }
);

const getPhaseName = (phaseId) => {
  if (!props.phases || !Array.isArray(props.phases)) return 'N/A';
  const phase = props.phases.find((p) => p.id === phaseId);
  return phase ? phase.nombre : 'N/A';
};

const priorityConfig = computed(() => {
  return (priority) => {
    switch (priority) {
      case 'Alta':
        return { color: 'error', icon: 'mdi-arrow-up-bold-circle' };
      case 'Media':
        return { color: 'warning', icon: 'mdi-minus-circle' };
      case 'Baja':
        return { color: 'info', icon: 'mdi-arrow-down-bold-circle' };
      default:
        return { color: 'grey', icon: 'mdi-help-circle' };
    }
  };
});

const complexityConfig = computed(() => {
  return (complexity) => {
    switch (complexity) {
      case 'Alta':
        return { color: 'error' };
      case 'Media':
        return { color: 'warning' };
      case 'Baja':
        return { color: 'success' };
      default:
        return { color: 'grey' };
    }
  };
});

const onDragEnd = (event) => {
  const { to, item } = event;
  const columnElement = to.parentElement;
  const statusElement = columnElement.querySelector('h3');
  if (!statusElement) return;
  
  const statusName = statusElement.textContent.trim();
  const status = statuses.find(s => s.name === statusName);
  if (!status) return;
  
  const taskId = item.getAttribute('data-id');
  emit('update:taskStatus', { taskId, newStatus: status.id });
};

const openTaskDetails = (task) => {
  emit('task-clicked', task);
};
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 16px;
}
.kanban-column {
  flex: 1;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
}
.kanban-drag-area {
  min-height: 200px;
}
.kanban-card {
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out;
}
.kanban-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
