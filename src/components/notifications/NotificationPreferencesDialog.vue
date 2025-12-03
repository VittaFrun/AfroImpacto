<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
    scrollable
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between bg-primary text-white">
        <div class="d-flex align-center">
          <v-icon class="mr-2" color="white">mdi-bell-cog</v-icon>
          <span>Preferencias de Notificaciones</span>
        </div>
        <v-btn
          icon
          variant="text"
          color="white"
          size="small"
          @click="$emit('update:modelValue', false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <!-- Configuración General -->
        <div class="mb-6">
          <h3 class="text-h6 mb-4">Configuración General</h3>
          
          <v-switch
            v-model="localSettings.enabled"
            label="Activar notificaciones"
            color="primary"
            hide-details
            class="mb-2"
          ></v-switch>
          
          <v-switch
            v-model="localSettings.sound"
            label="Sonido de notificaciones"
            color="primary"
            hide-details
            :disabled="!localSettings.enabled"
            class="mb-2"
          ></v-switch>
          
          <v-switch
            v-model="localSettings.desktop"
            label="Notificaciones del sistema"
            color="primary"
            hide-details
            :disabled="!localSettings.enabled"
            class="mb-2"
          ></v-switch>
          
          <v-switch
            v-model="localSettings.email"
            label="Notificaciones por correo"
            color="primary"
            hide-details
            :disabled="!localSettings.enabled"
          ></v-switch>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- Preferencias por Tipo -->
        <div>
          <h3 class="text-h6 mb-4">Tipos de Notificaciones</h3>
          <p class="text-body-2 text-grey mb-4">
            Selecciona qué tipos de notificaciones deseas recibir
          </p>

          <v-switch
            v-model="localSettings.projectStatusChanges"
            label="Cambios de estado de proyecto"
            color="primary"
            hide-details
            :disabled="!localSettings.enabled"
            class="mb-2"
          >
            <template v-slot:append>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" size="small" color="grey">mdi-information</v-icon>
                </template>
                Recibir notificaciones cuando cambie el estado de un proyecto
              </v-tooltip>
            </template>
          </v-switch>

          <v-switch
            v-model="localSettings.newAssignments"
            label="Nuevas asignaciones"
            color="primary"
            hide-details
            :disabled="!localSettings.enabled"
            class="mb-2"
          >
            <template v-slot:append>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" size="small" color="grey">mdi-information</v-icon>
                </template>
                Recibir notificaciones cuando te asignen a una nueva tarea
              </v-tooltip>
            </template>
          </v-switch>

          <v-switch
            v-model="localSettings.comments"
            label="Nuevos comentarios"
            color="primary"
            hide-details
            :disabled="!localSettings.enabled"
            class="mb-2"
          >
            <template v-slot:append>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" size="small" color="grey">mdi-information</v-icon>
                </template>
                Recibir notificaciones cuando haya nuevos comentarios en tus tareas
              </v-tooltip>
            </template>
          </v-switch>

          <v-switch
            v-model="localSettings.mentions"
            label="Menciones en comentarios"
            color="primary"
            hide-details
            :disabled="!localSettings.enabled"
            class="mb-2"
          >
            <template v-slot:append>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" size="small" color="grey">mdi-information</v-icon>
                </template>
                Recibir notificaciones cuando te mencionen en un comentario
              </v-tooltip>
            </template>
          </v-switch>

          <v-switch
            v-model="localSettings.taskDeadlines"
            label="Alertas de fechas límite"
            color="primary"
            hide-details
            :disabled="!localSettings.enabled"
            class="mb-2"
          >
            <template v-slot:append>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" size="small" color="grey">mdi-information</v-icon>
                </template>
                Recibir alertas cuando una tarea esté próxima a vencer
              </v-tooltip>
            </template>
          </v-switch>

          <v-switch
            v-model="localSettings.taskReminders"
            label="Recordatorios de tareas pendientes"
            color="primary"
            hide-details
            :disabled="!localSettings.enabled"
          >
            <template v-slot:append>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" size="small" color="grey">mdi-information</v-icon>
                </template>
                Recibir recordatorios de tareas que no han tenido actividad reciente
              </v-tooltip>
            </template>
          </v-switch>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleSave"
          :loading="saving"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notificationStore';
import { useNotifications } from '@/composables/useNotifications';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const notificationStore = useNotificationStore();
const { settings } = storeToRefs(notificationStore);
const { updateSettings } = notificationStore;
const { showSuccess, showError } = useNotifications();

const localSettings = ref({
  enabled: true,
  sound: true,
  desktop: true,
  email: false,
  push: false,
  projectStatusChanges: true,
  newAssignments: true,
  comments: true,
  mentions: true,
  taskDeadlines: true,
  taskReminders: true
});

const saving = ref(false);

// Cargar configuración actual cuando se abre el diálogo
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    localSettings.value = { ...settings.value };
  }
});

const handleSave = async () => {
  saving.value = true;
  try {
    updateSettings(localSettings.value);
    showSuccess('Preferencias de notificaciones guardadas correctamente');
    emit('update:modelValue', false);
  } catch (error) {
    console.error('Error saving notification preferences:', error);
    showError('Error al guardar las preferencias');
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.v-switch {
  margin-bottom: 8px;
}
</style>

