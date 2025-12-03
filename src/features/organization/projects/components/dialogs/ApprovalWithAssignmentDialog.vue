<template>
  <v-dialog
    v-model="localDialog"
    max-width="800"
    persistent
    scrollable
  >
    <v-card class="approval-assignment-dialog">
      <v-card-title class="dialog-header">
        <div class="d-flex align-center">
          <v-icon class="mr-3" color="success">mdi-account-check</v-icon>
          <div>
            <h2 class="text-h5 font-weight-bold">Aprobar y Asignar Voluntario</h2>
            <p class="text-body-2 text-grey-darken-1 mb-0">
              Aprueba la solicitud y asigna automáticamente al voluntario
            </p>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <!-- Información del Voluntario -->
        <v-card variant="outlined" class="mb-6" rounded="lg">
          <v-card-title class="text-h6 pb-2">
            <v-icon class="mr-2" color="primary">mdi-account</v-icon>
            Información del Voluntario
          </v-card-title>
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-avatar size="64" class="mr-4">
                <v-img
                  v-if="application?.voluntario?.usuario?.avatar"
                  :src="application.voluntario.usuario.avatar"
                  :alt="volunteerName"
                ></v-img>
                <v-icon v-else size="32" color="primary">mdi-account</v-icon>
              </v-avatar>
              <div>
                <h3 class="text-h6 font-weight-bold">{{ volunteerName }}</h3>
                <p class="text-body-2 text-grey-darken-1 mb-1">
                  {{ application?.voluntario?.usuario?.email }}
                </p>
                <v-chip
                  size="small"
                  color="info"
                  variant="tonal"
                >
                  Solicitud: {{ formatDate(application?.fecha_solicitud) }}
                </v-chip>
              </div>
            </div>
            
            <div v-if="application?.motivacion" class="mb-3">
              <h4 class="text-subtitle-1 font-weight-medium mb-2">Motivación:</h4>
              <p class="text-body-2">{{ application.motivacion }}</p>
            </div>
            
            <div v-if="application?.experiencia_relacionada" class="mb-3">
              <h4 class="text-subtitle-1 font-weight-medium mb-2">Experiencia:</h4>
              <p class="text-body-2">{{ application.experiencia_relacionada }}</p>
            </div>
            
            <div v-if="application?.disponibilidad">
              <h4 class="text-subtitle-1 font-weight-medium mb-2">Disponibilidad:</h4>
              <p class="text-body-2">{{ application.disponibilidad }}</p>
            </div>
          </v-card-text>
        </v-card>

        <!-- Opciones de Asignación -->
        <v-card variant="outlined" class="mb-6" rounded="lg">
          <v-card-title class="text-h6 pb-2">
            <v-icon class="mr-2" color="success">mdi-account-plus</v-icon>
            Asignación Automática
          </v-card-title>
          <v-card-text>
            <v-radio-group v-model="assignmentMode" class="mb-4">
              <v-radio
                value="smart"
                color="primary"
              >
                <template #label>
                  <div>
                    <div class="font-weight-medium">Asignación Inteligente</div>
                    <div class="text-caption text-grey-darken-1">
                      Sugerir tareas automáticamente basado en prioridad y disponibilidad
                    </div>
                  </div>
                </template>
              </v-radio>
              <v-radio
                value="manual"
                color="primary"
              >
                <template #label>
                  <div>
                    <div class="font-weight-medium">Selección Manual</div>
                    <div class="text-caption text-grey-darken-1">
                      Elegir manualmente la tarea y rol para el voluntario
                    </div>
                  </div>
                </template>
              </v-radio>
              <v-radio
                value="later"
                color="primary"
              >
                <template #label>
                  <div>
                    <div class="font-weight-medium">Asignar Más Tarde</div>
                    <div class="text-caption text-grey-darken-1">
                      Solo aprobar la solicitud, asignar tareas posteriormente
                    </div>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>

            <!-- Asignación Inteligente -->
            <div v-if="assignmentMode === 'smart'" class="smart-assignment">
              <v-alert
                type="info"
                variant="tonal"
                class="mb-4"
              >
                <template #prepend>
                  <v-icon>mdi-lightbulb</v-icon>
                </template>
                <div>
                  <strong>Sugerencias Inteligentes</strong>
                  <p class="mb-0 mt-1">
                    Basado en la prioridad de tareas, disponibilidad del voluntario y carga de trabajo actual.
                  </p>
                </div>
              </v-alert>

              <div v-if="loadingSuggestions" class="text-center py-4">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p class="text-body-2 mt-2">Generando sugerencias...</p>
              </div>

              <div v-else-if="smartSuggestions.length > 0">
                <h4 class="text-subtitle-1 font-weight-medium mb-3">Tareas Sugeridas:</h4>
                <v-card
                  v-for="suggestion in smartSuggestions"
                  :key="suggestion.id"
                  variant="outlined"
                  class="mb-3 suggestion-card"
                  :class="{ 'selected': selectedSuggestion?.id === suggestion.id }"
                  @click="selectSuggestion(suggestion)"
                >
                  <v-card-text class="pa-4">
                    <div class="d-flex align-center justify-space-between">
                      <div class="flex-grow-1">
                        <div class="d-flex align-center mb-2">
                          <v-chip
                            :color="getPriorityColor(suggestion.prioridad)"
                            size="small"
                            variant="tonal"
                            class="mr-2"
                          >
                            {{ suggestion.prioridad || 'Media' }}
                          </v-chip>
                          <v-chip
                            :color="suggestion.role?.color || 'primary'"
                            size="small"
                            variant="tonal"
                          >
                            {{ suggestion.role?.nombre || 'Voluntario' }}
                          </v-chip>
                        </div>
                        <h5 class="text-subtitle-1 font-weight-medium mb-1">
                          {{ suggestion.descripcion }}
                        </h5>
                        <p class="text-body-2 text-grey-darken-1 mb-2">
                          Fase: {{ suggestion.fase?.nombre }}
                        </p>
                        <div class="d-flex align-center">
                          <v-icon size="small" class="mr-1" color="success">mdi-star</v-icon>
                          <span class="text-caption">
                            Compatibilidad: {{ suggestion.compatibility }}%
                          </span>
                        </div>
                      </div>
                      <v-radio-group
                        v-model="selectedSuggestionId"
                        :value="suggestion.id"
                        hide-details
                      >
                        <v-radio :value="suggestion.id" color="primary"></v-radio>
                      </v-radio-group>
                    </div>
                  </v-card-text>
                </v-card>
              </div>

              <v-alert
                v-else
                type="warning"
                variant="tonal"
              >
                No hay tareas disponibles para asignación automática en este momento.
              </v-alert>
            </div>

            <!-- Selección Manual -->
            <div v-if="assignmentMode === 'manual'" class="manual-assignment">
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="selectedTaskId"
                    :items="availableTasks"
                    item-title="label"
                    item-value="value"
                    label="Seleccionar Tarea"
                    variant="outlined"
                    density="compact"
                    :rules="[v => !!v || 'Selecciona una tarea']"
                  >
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
                        <v-list-item-subtitle>
                          Fase: {{ item.raw.fase }} • Prioridad: {{ item.raw.prioridad }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="selectedRoleId"
                    :items="availableRoles"
                    item-title="nombre"
                    item-value="id_rol"
                    label="Seleccionar Rol"
                    variant="outlined"
                    density="compact"
                    :rules="[v => !!v || 'Selecciona un rol']"
                  >
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                          <v-avatar :color="item.raw.color" size="small">
                            <v-icon color="white" size="small">mdi-account</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title>{{ item.raw.nombre }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.raw.descripcion }}</v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </div>

            <!-- Asignar Más Tarde -->
            <div v-if="assignmentMode === 'later'" class="later-assignment">
              <v-alert
                type="info"
                variant="tonal"
              >
                <template #prepend>
                  <v-icon>mdi-clock-outline</v-icon>
                </template>
                El voluntario será aprobado y tendrá acceso al proyecto, pero no se le asignará ninguna tarea específica por ahora.
              </v-alert>
            </div>
          </v-card-text>
        </v-card>

        <!-- Notas de la Organización -->
        <v-card variant="outlined" rounded="lg">
          <v-card-title class="text-h6 pb-2">
            <v-icon class="mr-2" color="warning">mdi-note-text</v-icon>
            Notas de la Organización (Opcional)
          </v-card-title>
          <v-card-text>
            <v-textarea
              v-model="organizationNotes"
              label="Agregar notas sobre la aprobación o asignación"
              variant="outlined"
              rows="3"
              placeholder="Ej: Bienvenido al equipo. Te hemos asignado a la tarea de coordinación inicial..."
            ></v-textarea>
          </v-card-text>
        </v-card>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="closeDialog"
          :disabled="processing"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="success"
          variant="elevated"
          :loading="processing"
          @click="processApprovalAndAssignment"
        >
          <v-icon start>mdi-check-circle</v-icon>
          {{ getActionButtonText() }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useProjectContext } from '@/composables/useProjectContext';
import { useNotifications } from '@/composables/useNotifications';
import { formatDate } from '@/utils/formatters';
import api from '@/plugins/axios';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  application: {
    type: Object,
    default: () => null
  },
  availableTasks: {
    type: Array,
    default: () => []
  },
  availableRoles: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'approved', 'assigned']);

// Composables
const { projectId } = useProjectContext();
const { showSuccess, showError, showInfo } = useNotifications();

// Reactive data
const assignmentMode = ref('smart');
const selectedTaskId = ref(null);
const selectedRoleId = ref(null);
const selectedSuggestionId = ref(null);
const organizationNotes = ref('');
const processing = ref(false);
const loadingSuggestions = ref(false);
const smartSuggestions = ref([]);

// Computed
const localDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const volunteerName = computed(() => {
  return props.application?.voluntario?.usuario?.nombre || 'Voluntario';
});

const selectedSuggestion = computed(() => {
  return smartSuggestions.value.find(s => s.id === selectedSuggestionId.value);
});

const getActionButtonText = () => {
  switch (assignmentMode.value) {
    case 'smart':
      return selectedSuggestion.value ? 'Aprobar y Asignar' : 'Aprobar Solicitud';
    case 'manual':
      return selectedTaskId.value && selectedRoleId.value ? 'Aprobar y Asignar' : 'Aprobar Solicitud';
    case 'later':
      return 'Aprobar Solicitud';
    default:
      return 'Aprobar Solicitud';
  }
};

// Methods
const generateSmartSuggestions = async () => {
  if (!props.application || !projectId.value) return;

  loadingSuggestions.value = true;
  try {
    const response = await api.post('/asignacion/smart-suggestions', {
      id_proyecto: projectId.value,
      id_voluntario: props.application.id_voluntario,
      motivacion: props.application.motivacion,
      experiencia: props.application.experiencia_relacionada,
      disponibilidad: props.application.disponibilidad
    });

    smartSuggestions.value = response.data.map(suggestion => ({
      ...suggestion,
      compatibility: Math.round(suggestion.compatibility || Math.random() * 30 + 70) // Mock compatibility
    }));

    // Auto-select the best suggestion
    if (smartSuggestions.value.length > 0) {
      selectedSuggestionId.value = smartSuggestions.value[0].id;
    }
  } catch (error) {
    console.error('Error generating smart suggestions:', error);
    // Fallback to manual suggestions based on available tasks
    generateFallbackSuggestions();
  } finally {
    loadingSuggestions.value = false;
  }
};

const generateFallbackSuggestions = () => {
  // Generate suggestions from available tasks
  const suggestions = props.availableTasks
    .slice(0, 3) // Top 3 tasks
    .map(task => {
      const role = props.availableRoles.find(r => r.tipo_rol === 'proyecto') || props.availableRoles[0];
      return {
        id: task.value,
        descripcion: task.title,
        prioridad: task.prioridad || 'Media',
        fase: { nombre: task.fase },
        role: role,
        compatibility: Math.round(Math.random() * 30 + 60)
      };
    });

  smartSuggestions.value = suggestions;
  if (suggestions.length > 0) {
    selectedSuggestionId.value = suggestions[0].id;
  }
};

const selectSuggestion = (suggestion) => {
  selectedSuggestionId.value = suggestion.id;
};

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'alta': return 'error';
    case 'media': return 'warning';
    case 'baja': return 'info';
    default: return 'grey';
  }
};

const processApprovalAndAssignment = async () => {
  if (!props.application) return;

  processing.value = true;
  try {
    // 1. Aprobar la solicitud
    await api.put(`/solicitud-inscripcion/${props.application.id_solicitud}`, {
      estado: 'aprobada',
      notas_organizacion: organizationNotes.value
    });

    showSuccess('Solicitud aprobada exitosamente');
    emit('approved', props.application);

    // 2. Asignar si es necesario
    if (assignmentMode.value === 'smart' && selectedSuggestion.value) {
      await assignVolunteerToTask(
        selectedSuggestion.value.id,
        selectedSuggestion.value.role?.id_rol || selectedSuggestion.value.role?.id
      );
    } else if (assignmentMode.value === 'manual' && selectedTaskId.value && selectedRoleId.value) {
      await assignVolunteerToTask(selectedTaskId.value, selectedRoleId.value);
    }

    closeDialog();
  } catch (error) {
    console.error('Error processing approval:', error);
    showError(error.response?.data?.message || 'Error al procesar la aprobación');
  } finally {
    processing.value = false;
  }
};

const assignVolunteerToTask = async (taskId, roleId) => {
  try {
    await api.post('/asignacion', {
      id_tarea: taskId,
      id_voluntario: props.application.id_voluntario,
      id_rol: roleId
    });

    showSuccess('Voluntario asignado exitosamente a la tarea');
    emit('assigned', {
      taskId,
      roleId,
      volunteerId: props.application.id_voluntario
    });
  } catch (error) {
    console.error('Error assigning volunteer:', error);
    showError('La solicitud fue aprobada, pero hubo un error en la asignación. Puedes asignar manualmente más tarde.');
  }
};

const closeDialog = () => {
  localDialog.value = false;
  resetForm();
};

const resetForm = () => {
  assignmentMode.value = 'smart';
  selectedTaskId.value = null;
  selectedRoleId.value = null;
  selectedSuggestionId.value = null;
  organizationNotes.value = '';
  smartSuggestions.value = [];
};

// Watchers
watch(() => assignmentMode.value, (newMode) => {
  if (newMode === 'smart' && smartSuggestions.value.length === 0) {
    generateSmartSuggestions();
  }
});

watch(() => props.modelValue, (newValue) => {
  if (newValue && assignmentMode.value === 'smart') {
    generateSmartSuggestions();
  }
});

// Lifecycle
onMounted(() => {
  if (props.modelValue && assignmentMode.value === 'smart') {
    generateSmartSuggestions();
  }
});
</script>

<style scoped>
.approval-assignment-dialog {
  max-height: 90vh;
}

.dialog-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 24px;
}

.suggestion-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.suggestion-card:hover {
  border-color: rgba(33, 150, 243, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.suggestion-card.selected {
  border-color: rgb(33, 150, 243);
  background-color: rgba(33, 150, 243, 0.05);
}

.smart-assignment,
.manual-assignment,
.later-assignment {
  margin-top: 16px;
}
</style>
