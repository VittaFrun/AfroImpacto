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
              <p class="font-weight-bold">{{ element.description }}</p>
              <p class="text-caption">Fase: {{ getPhaseName(element.phaseId) }}</p>
              <div class="mt-2">
                <v-chip
                  v-for="assignment in element.assignments"
                  :key="assignment.assignmentId"
                  size="small"
                  class="mr-2"
                  :color="assignment.roleColor"
                >
                  <v-icon start>mdi-account-circle</v-icon>
                  {{ assignment.volunteerName }}
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
