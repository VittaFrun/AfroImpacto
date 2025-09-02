<template>
  <v-container fluid class="pa-8">
    <v-card class="project-create-card" elevation="0" variant="flat">
      <v-card-title class="text-h5 font-weight-bold pa-6" style="color: #344767;">
        {{ isEditing ? 'Editar Proyecto' : 'Crear Nuevo Proyecto' }}
      </v-card-title>
      <v-divider></v-divider>

      <v-stepper v-model="currentStep" class="elevation-0">
        <v-stepper-header class="elevation-0">
          <v-stepper-item title="Información Básica" :value="1" :complete="currentStep > 1"></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item title="Fases del Proyecto" :value="2" :complete="currentStep > 2"></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item title="Revisión y Envío" :value="3"></v-stepper-item>
        </v-stepper-header>

        <v-stepper-window>
          <!-- Step 1: Basic Information -->
          <v-stepper-window-item :value="1">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="project.name" label="Nombre del Proyecto" variant="outlined"
                    color="primary"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="project.description" label="Descripción Corta" variant="outlined" color="primary"
                    rows="3"></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="project.objective" label="Objetivo Principal" variant="outlined" color="primary"
                    rows="3"></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="project.location" label="Ubicación" variant="outlined" color="primary"
                    prepend-inner-icon="mdi-map-marker"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-file-input :model-value="project.coverImage ? [project.coverImage] : []"
                    @update:model-value="handleCoverImageUpdate" label="Imagen de Portada" variant="outlined"
                    color="primary" prepend-icon="" prepend-inner-icon="mdi-image" accept="image/*"></v-file-input>
                </v-col>
                <v-col v-if="coverImagePreview" cols="12">
                  <p class="text-subtitle-1 font-weight-bold">Vista Previa de la Imagen:</p>
                  <v-img :src="coverImagePreview" max-height="200" contain class="mt-2"></v-img>
                </v-col>
                <v-col cols="12" md="6">
                  <v-file-input v-model="project.files" label="Adjuntar Documentos" multiple variant="outlined"
                    color="primary" prepend-icon="" prepend-inner-icon="mdi-paperclip">
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
                  <v-text-field v-model="project.startDate" label="Fecha de Inicio" type="date" variant="outlined"
                    color="primary"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="project.endDate" label="Fecha de Fin" type="date" variant="outlined"
                    color="primary"></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-stepper-window-item>

          <!-- Step 2: Project Phases -->
          <v-stepper-window-item :value="2">
            <v-card-text>
              <v-row align="center">
                <v-col cols="12" md="5">
                  <v-text-field v-model="newPhase.name" label="Nombre de la Fase" variant="outlined" color="primary"
                    hide-details></v-text-field>
                </v-col>
                <v-col cols="12" md="5">
                  <v-text-field v-model="newPhase.description" label="Descripción de la Fase" variant="outlined"
                    color="primary" hide-details></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-btn color="primary" @click="addPhase" block>
                    Añadir Fase
                  </v-btn>
                </v-col>
              </v-row>
              <v-list lines="two" class="mt-4 phases-list">
                <transition-group name="list" tag="div">
                  <v-list-item v-for="(phase, index) in project.phases" :key="index" :title="phase.name"
                    :subtitle="phase.description" class="list-item">
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

          <!-- Step 3: Review -->
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
                <v-img :src="coverImagePreview" max-height="150" contain class="mt-2"></v-img>
              </div>

              <div v-if="project.files.length" class="mt-4">
                <h4 class="text-subtitle-1 font-weight-bold">Archivos Adjuntos:</h4>
                <v-chip v-for="file in project.files" :key="file.name" class="ma-1" color="primary" label size="small">
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
          <v-btn v-if="currentStep === 3" color="primary" variant="flat" @click="submitProject" :loading="isLoading"
            :disabled="isLoading">
            {{ isEditing ? 'Guardar Cambios' : 'Crear Proyecto' }}
          </v-btn>
        </v-card-actions>
      </v-stepper>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const { error } = storeToRefs(projectStore);

const currentStep = ref(1);
const isLoading = ref(false);
const isEditing = computed(() => !!route.query.id);

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
});

const coverImagePreview = ref(null);
const newPhase = ref({ name: '', description: '' });

onMounted(async () => {
  if (isEditing.value) {
    const projectId = parseInt(route.query.id);
    // Fetch fresh data from the store/API
    const existingProject = await projectStore.fetchProjectById(projectId);
    if (existingProject) {
      project.value = { 
        ...existingProject,
        // Ensure files are handled correctly, as they won't be part of the JSON response
        coverImage: null,
        files: [],
       };
      if (existingProject.coverImage) {
        coverImagePreview.value = existingProject.coverImage; // This should be a URL from the backend
      }
    }
  }
});

function handleCoverImageUpdate(files) {
  const file = files[0];
  if (file) {
    project.value.coverImage = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      coverImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    project.value.coverImage = null;
    coverImagePreview.value = null;
  }
}

function addPhase() {
  if (newPhase.value.name) {
    project.value.phases.push({ ...newPhase.value });
    newPhase.value.name = '';
    newPhase.value.description = '';
  }
}

function removePhase(index) {
  project.value.phases.splice(index, 1);
}

async function submitProject() {
  isLoading.value = true;

  const formData = new FormData();
  
  // Append all non-file fields
  Object.keys(project.value).forEach(key => {
    const value = project.value[key];
    if (key === 'coverImage' || key === 'files') {
      // Skip, will be handled separately
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  // Append cover image if it's a new file
  if (project.value.coverImage instanceof File) {
    formData.append('coverImage', project.value.coverImage);
  }

  // Append other files
  if (project.value.files && project.value.files.length > 0) {
    project.value.files.forEach(file => {
      formData.append('files', file);
    });
  }

  let result;
  if (isEditing.value) {
    result = await projectStore.updateProject(project.value.id, formData);
  } else {
    result = await projectStore.addProject(formData);
  }

  isLoading.value = false;

  if (result) {
    alert(`Proyecto ${isEditing.value ? 'actualizado' : 'creado'} con éxito!`);
    router.push('/organization/dashboard/projects');
  } else {
    alert(`Error: ${error.value || 'No se pudo guardar el proyecto.'}`);
  }
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