<template>
  <div class="kanban-board">
    <div v-for="status in statuses" :key="status" class="kanban-column">
      <h3 class="text-subtitle-1 font-weight-bold mb-4">{{ status }}</h3>
      <draggable
        v-model="tasksByStatus[status]"
        group="tasks"
        item-key="id"
        class="kanban-drag-area"
        @end="onDragEnd"
      >
        <template #item="{ element }">
          <v-card class="kanban-card mb-4" @click="openTaskDetails(element)" :data-id="element.id">
            <v-card-text>
              <p class="font-weight-bold mb-2">{{ element.description }}</p>
              <p class="text-caption text-grey-darken-1 mb-3">Fase: {{ getPhaseName(element.phaseId) }}</p>
              
              <div class="d-flex align-center justify-space-between mt-2">
                <!-- Priority Chip -->
                <v-chip
                  v-if="element.priority"
                  :color="priorityConfig(element.priority).color"
                  size="small"
                  variant="tonal"
                  class="font-weight-bold"
                >
                  <v-icon start :icon="priorityConfig(element.priority).icon"></v-icon>
                  {{ element.priority }}
                </v-chip>

                <!-- Volunteer Avatars -->
                <div class="d-flex">
                  <v-chip
                    v-for="assignment in element.assignments"
                    :key="assignment.assignmentId"
                    size="small"
                    class="ml-1"
                  >
                    <v-avatar start>
                      <span class="text-caption">{{ assignment.volunteerName.charAt(0) }}</span>
                    </v-avatar>
                    {{ assignment.volunteerName.split(' ')[0] }}
                  </v-chip>
                </div>
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
    required: true,
  },
  phases: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:taskStatus', 'task-clicked']);

const statuses = ['Pendiente', 'En Progreso', 'Completado'];

const tasksByStatus = ref({
  Pendiente: [],
  'En Progreso': [],
  Completado: [],
});

watch(
  () => props.tasks,
  (newTasks) => {
    tasksByStatus.value = {
      Pendiente: newTasks.filter((t) => t.status === 'Pendiente'),
      'En Progreso': newTasks.filter((t) => t.status === 'En Progreso'),
      Completado: newTasks.filter((t) => t.status === 'Completado'),
    };
  },
  { immediate: true, deep: true }
);

const getPhaseName = (phaseId) => {
  const phase = props.phases.find((p) => p.id === phaseId);
  return phase ? phase.name : 'N/A';
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

const onDragEnd = (event) => {
  const { to, item } = event;
  const newStatus = to.parentElement.querySelector('h3').textContent.trim();
  const taskId = item.getAttribute('data-id');
  emit('update:taskStatus', { taskId, newStatus });
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
