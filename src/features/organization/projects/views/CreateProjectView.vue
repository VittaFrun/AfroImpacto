<template>
  <v-container fluid class="pa-8">
    <v-card class="project-create-card" elevation="0" variant="flat">
    <v-card-title class="text-h5 font-weight-bold pa-6" style="color: #344767;">
      Crear Nuevo Proyecto
    </v-card-title>
      <v-divider></v-divider>

      <v-stepper v-model="currentStep" class="elevation-0">
        <v-stepper-header class="elevation-0">
          <v-stepper-item
            title="Información Básica"
            :value="1"
            :complete="currentStep > 1"
          ></v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item
            title="Fases del Proyecto"
            :value="2"
            :complete="currentStep > 2"
          ></v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item
            title="Revisión y Envío"
            :value="3"
          ></v-stepper-item>
        </v-stepper-header>

        <v-stepper-window>
          <!-- Paso 1: Información Básica -->
          <v-stepper-window-item :value="1">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="project.name"
                    label="Nombre del Proyecto"
                    variant="outlined"
                    color="primary"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="project.description"
                    label="Descripción Corta"
                    variant="outlined"
                    color="primary"
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="project.objective"
                    label="Objetivo Principal"
                    variant="outlined"
                    color="primary"
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="project.location"
                    label="Ubicación"
                    variant="outlined"
                    color="primary"
                    prepend-inner-icon="mdi-map-marker"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="project.coverImage"
                    label="Imagen de Portada"
                    variant="outlined"
                    color="primary"
                    prepend-icon=""
                    prepend-inner-icon="mdi-image"
                    accept="image/*"
                    @change="previewCoverImage"
                  ></v-file-input>
                </v-col>
                <v-col v-if="coverImagePreview" cols="12">
                  <p class="text-subtitle-1 font-weight-bold">Vista Previa de la Imagen:</p>
                  <v-img
                    :src="coverImagePreview"
                    max-height="200"
                    contain
                    class="mt-2"
                  ></v-img>
                </v-col>
                <v-col cols="12" md="6">
                   <v-file-input
                    v-model="project.files"
                    label="Adjuntar Documentos"
                    multiple
                    variant="outlined"
                    color="primary"
                    prepend-icon=""
                    prepend-inner-icon="mdi-paperclip"
                  >
                    <template v-slot:selection="{ fileNames }">
                      <template v-for="fileName in fileNames" :key="fileName">
                        <v-chip class="ma-1" color="primary" label size="small">
                          {{ fileName }}
                        </v-chip>
                      </template>
                    </template>
                  </v-file-input>
                </v-col>
                 <v-col cols="12" md="6">
                  <v-text-field
                    v-model="project.startDate"
                    label="Fecha de Inicio"
                    type="date"
                    variant="outlined"
                    color="primary"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="project.endDate"
                    label="Fecha de Fin"
                    type="date"
                    variant="outlined"
                    color="primary"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-stepper-window-item>

          <!-- Paso 2: Fases del Proyecto -->
          <v-stepper-window-item :value="2">
            <v-card-text>
              <v-row align="center">
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="newPhase.name"
                    label="Nombre de la Fase"
                    variant="outlined"
                    color="primary"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="newPhase.description"
                    label="Descripción de la Fase"
                    variant="outlined"
                    color="primary"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-btn color="primary" @click="addPhase" block>
                    Añadir Fase
                  </v-btn>
                </v-col>
              </v-row>
              <v-list lines="two" class="mt-4 phases-list">
                <transition-group name="list" tag="div">
                  <v-list-item
                    v-for="(phase, index) in project.phases"
                    :key="index"
                    :title="phase.name"
                    :subtitle="phase.description"
                    class="list-item"
                  >
                    <template v-slot:append>
                      <v-btn icon="mdi-delete" variant="text" color="error" @click="removePhase(index)"></v-btn>
                    </template>
                  </v-list-item>
                </transition-group>
                <v-card-text v-if="project.phases.length === 0" class="text-center grey--text">
                  Aún no has añadido ninguna fase.
                </v-card-text>
              </v-list>
            </v-card-text>
          </v-stepper-window-item>

          <!-- Paso 3: Revisión -->
          <v-stepper-window-item :value="3">
            <v-card-text>
              <h3 class="text-h6 font-weight-bold" style="color: #344767;">Revisa la Información</h3>
              <v-divider class="my-4"></v-divider>
              
              <v-list density="compact" class="py-0">
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Nombre:</v-list-item-title>
                  <v-list-item-subtitle>{{ project.name }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Descripción:</v-list-item-title>
                  <v-list-item-subtitle>{{ project.description }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Objetivo:</v-list-item-title>
                  <v-list-item-subtitle>{{ project.objective }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Ubicación:</v-list-item-title>
                  <v-list-item-subtitle>{{ project.location }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Fechas:</v-list-item-title>
                  <v-list-item-subtitle>{{ project.startDate }} - {{ project.endDate }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <div v-if="coverImagePreview" class="mt-4">
                <h4 class="text-subtitle-1 font-weight-bold">Imagen de Portada:</h4>
                <v-img
                  :src="coverImagePreview"
                  max-height="150"
                  contain
                  class="mt-2"
                ></v-img>
              </div>

              <div v-if="project.files.length" class="mt-4">
                <h4 class="text-subtitle-1 font-weight-bold">Archivos Adjuntos:</h4>
                <v-chip 
                  v-for="file in project.files" 
                  :key="file.name" 
                  class="ma-1"
                  color="primary"
                  label
                  size="small"
                >
                  {{ file.name }}
                </v-chip>
              </div>

              <div v-if="project.phases.length" class="mt-4">
                <h4 class="text-subtitle-1 font-weight-bold">Fases del Proyecto:</h4>
                <v-list density="compact" class="py-0">
                  <v-list-item v-for="phase in project.phases" :key="phase.name">
                    <v-list-item-title class="font-weight-medium">{{ phase.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ phase.description }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>
            </v-card-text>
          </v-stepper-window-item>
        </v-stepper-window>

        <v-card-actions class="pa-6">
          <v-btn v-if="currentStep > 1" @click="currentStep--" prepend-icon="mdi-arrow-left">
            Atrás
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="currentStep < 3" color="primary" @click="currentStep++" append-icon="mdi-arrow-right">
            Siguiente
          </v-btn>
          <v-btn 
            v-if="currentStep === 3" 
            color="primary" 
            variant="flat" 
            @click="submitProject"
            :loading="isLoading"
            :disabled="isLoading"
          >
            Crear Proyecto
          </v-btn>
        </v-card-actions>
      </v-stepper>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();

const currentStep = ref(1);
const isLoading = ref(false);

const project = ref({
  id: null,
  name: '',
  description: '',
  objective: '',
  location: '',
  startDate: '',
  endDate: '',
  coverImage: null,
  files: [],
  phases: [],
  status: 'Pendiente',
  statusColor: 'orange',
  progress: { percentage: 0, completedPhases: 0, totalPhases: 0 },
});

const coverImagePreview = ref(null);

const newPhase = ref({
  name: '',
  description: '',
});

// Load project data if editing
onMounted(() => {
  if (route.query.id) {
    const projectId = parseInt(route.query.id);
    const existingProject = projectStore.getProjectById(projectId);
    if (existingProject) {
      project.value = { ...existingProject };
      if (existingProject.coverImage) {
        // If coverImage is a URL, set it for preview
        if (typeof existingProject.coverImage === 'string') {
          coverImagePreview.value = existingProject.coverImage;
        }
      }
    }
  }
});

function previewCoverImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      coverImagePreview.value = e.target.result;
      project.value.coverImage = e.target.result; // Store the base64 string
    };
    reader.readAsDataURL(file);
  }
}

function addPhase() {
  if (newPhase.value.name) {
    project.value.phases.push({ 
      ...newPhase.value, 
      id: project.value.phases.length + 1, // Simple ID for phases
      status: 'Pendiente', 
      statusColor: 'orange' 
    });
    newPhase.value.name = '';
    newPhase.value.description = '';
    // Update total phases for progress
    project.value.progress.totalPhases = project.value.phases.length;
  }
}

function removePhase(index) {
  project.value.phases.splice(index, 1);
  // Update total phases for progress
  project.value.progress.totalPhases = project.value.phases.length;
}

function submitProject() {
  isLoading.value = true;

  // Update progress based on phases
  const completedPhasesCount = project.value.phases.filter(p => p.status === 'Completado').length;
  project.value.progress.completedPhases = completedPhasesCount;
  project.value.progress.percentage = project.value.phases.length > 0 
    ? Math.round((completedPhasesCount / project.value.phases.length) * 100) 
    : 0;

  if (project.value.id) {
    projectStore.updateProject(project.value);
    alert('Proyecto actualizado con éxito!');
  } else {
    projectStore.addProject(project.value);
    alert('Proyecto creado con éxito!');
  }

  setTimeout(() => {
    isLoading.value = false;
    router.push('/organization/dashboard/projects');
  }, 1000); // Simulate API call and redirect
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.v-btn.v-btn--elevated {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.v-btn--variant-flat,
.v-btn--variant-elevated {
  &.bg-primary {
    color: white !important;
  }
}

.project-create-card {
  border-radius: 20px !important;
  border: none !important;
}

:deep(.v-text-field .v-field),
:deep(.v-file-input .v-field) {
  border-radius: 15px !important;
  color: rgb(114, 114, 114);
}

:deep(.v-stepper-header .v-stepper-item__title) {
  font-weight: bold;
  color: #344767;
}

.v-card-actions .v-btn{
  border: 1px solid #dbdbdb;
}


</style>
