<template>
  <div class="volunteer-enrollment-form">
    <v-form ref="formRef" @submit.prevent="handleSubmit">
      <v-alert
        v-if="error"
        type="error"
        class="mb-4"
        dismissible
        @update:model-value="error = null"
      >
        {{ error }}
      </v-alert>

      <!-- Campos básicos del formulario -->
      <div class="mb-6">
        <h3 class="text-h6 mb-4">Información Básica</h3>
        
        <v-textarea
          v-model="formData.motivacion"
          label="Motivación para Participar"
          placeholder="¿Por qué te interesa participar en este proyecto? ¿Qué te motiva a ser voluntario?"
          variant="outlined"
          rows="4"
          :rules="[v => !!v || 'La motivación es requerida']"
          class="mb-4"
        ></v-textarea>

        <v-textarea
          v-model="formData.disponibilidad"
          label="Disponibilidad de Tiempo"
          placeholder="Describe tu disponibilidad de tiempo para el proyecto (horas por semana, días disponibles, etc.)"
          variant="outlined"
          rows="3"
          :rules="[v => !!v || 'La disponibilidad es requerida']"
          class="mb-4"
        ></v-textarea>

        <v-textarea
          v-model="formData.experiencia_relacionada"
          label="Experiencia Relacionada"
          placeholder="Describe tu experiencia, habilidades o conocimientos relacionados con este proyecto"
          variant="outlined"
          rows="3"
          class="mb-4"
        ></v-textarea>
      </div>

      <!-- Campos dinámicos del formulario personalizado -->
      <div v-if="camposFormulario.length > 0" class="mb-6">
        <h3 class="text-h6 mb-4">Información Adicional</h3>
        <div v-for="campo in camposFormulario" :key="campo.id_formulario" class="mb-4">
          <!-- Campo de texto -->
          <v-text-field
            v-if="campo.tipo_campo === 'text'"
            v-model="camposPersonalizados[campo.nombre_campo]"
            :label="campo.etiqueta"
            :placeholder="campo.placeholder"
            variant="outlined"
            :rules="campo.requerido ? [v => !!v || 'Este campo es requerido'] : []"
          ></v-text-field>

          <!-- Campo de textarea -->
          <v-textarea
            v-else-if="campo.tipo_campo === 'textarea'"
            v-model="camposPersonalizados[campo.nombre_campo]"
            :label="campo.etiqueta"
            :placeholder="campo.placeholder"
            variant="outlined"
            rows="3"
            :rules="campo.requerido ? [v => !!v || 'Este campo es requerido'] : []"
          ></v-textarea>

          <!-- Campo numérico -->
          <v-text-field
            v-else-if="campo.tipo_campo === 'number'"
            v-model.number="camposPersonalizados[campo.nombre_campo]"
            :label="campo.etiqueta"
            :placeholder="campo.placeholder"
            type="number"
            variant="outlined"
            :rules="campo.requerido ? [v => v !== null && v !== undefined || 'Este campo es requerido'] : []"
          ></v-text-field>

          <!-- Campo de fecha -->
          <v-text-field
            v-else-if="campo.tipo_campo === 'date'"
            v-model="camposPersonalizados[campo.nombre_campo]"
            :label="campo.etiqueta"
            :placeholder="campo.placeholder"
            type="date"
            variant="outlined"
            :rules="campo.requerido ? [v => !!v || 'Este campo es requerido'] : []"
          ></v-text-field>

          <!-- Campo select -->
          <v-select
            v-else-if="campo.tipo_campo === 'select'"
            v-model="camposPersonalizados[campo.nombre_campo]"
            :label="campo.etiqueta"
            :placeholder="campo.placeholder"
            :items="parseOpciones(campo.opciones)"
            variant="outlined"
            :rules="campo.requerido ? [v => !!v || 'Este campo es requerido'] : []"
          ></v-select>

          <!-- Campo de archivo -->
          <v-file-input
            v-else-if="campo.tipo_campo === 'file'"
            v-model="archivos[campo.nombre_campo]"
            :label="campo.etiqueta"
            :placeholder="campo.placeholder"
            variant="outlined"
            :rules="campo.requerido ? [v => !!v || 'Este archivo es requerido'] : []"
            show-size
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          ></v-file-input>
        </div>
      </div>

      <!-- Sección de documentos adjuntos -->
      <div class="mb-6">
        <h3 class="text-h6 mb-4">Documentos Adjuntos (Opcional)</h3>
        <p class="text-body-2 text-grey mb-4">
          Puedes adjuntar documentos como CV, certificados, o cualquier otro documento relevante
        </p>
        
        <v-file-input
          v-model="documentosGenerales"
          label="Documentos Adicionales"
          variant="outlined"
          multiple
          show-size
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          hint="Puedes seleccionar múltiples archivos"
          persistent-hint
        ></v-file-input>
      </div>

      <v-divider class="my-6"></v-divider>

      <div class="d-flex justify-end gap-2">
        <v-btn
          color="grey"
          variant="outlined"
          @click="$emit('cancel')"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          type="submit"
          :loading="loading"
          :disabled="loading"
        >
          Enviar Solicitud
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFormularioInscripcionStore } from '@/features/organization/projects/stores/formularioInscripcionStore';
import { useSolicitudInscripcionStore } from '@/features/organization/projects/stores/solicitudInscripcionStore';
import { useNotificationStore } from '@/stores/notificationStore';

const props = defineProps({
  projectId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['submit', 'cancel', 'success', 'error']);

const formRef = ref(null);
const formularioStore = useFormularioInscripcionStore();
const solicitudStore = useSolicitudInscripcionStore();
const notificationStore = useNotificationStore();

const loading = ref(false);
const error = ref(null);
const camposFormulario = ref([]);

const formData = ref({
  motivacion: '',
  disponibilidad: '',
  experiencia_relacionada: ''
});

const camposPersonalizados = ref({});
const archivos = ref({});
const documentosGenerales = ref([]);

onMounted(async () => {
  // Cargar campos del formulario personalizado
  try {
    const campos = await formularioStore.fetchByProject(props.projectId);
    camposFormulario.value = campos || [];
  } catch (err) {
    console.error('Error loading form fields:', err);
    // No mostrar error si no hay campos personalizados, es opcional
  }
});

function parseOpciones(opciones) {
  if (!opciones) return [];
  try {
    const parsed = JSON.parse(opciones);
    return Array.isArray(parsed) ? parsed : Object.values(parsed);
  } catch {
    // Si no es JSON válido, intentar como string separado por comas
    return opciones.split(',').map(o => o.trim());
  }
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    error.value = 'Por favor completa todos los campos requeridos';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // El backend ahora obtiene automáticamente el id_voluntario del usuario autenticado
    // Solo necesitamos enviar id_proyecto y los datos del formulario
    const solicitudData = {
      id_proyecto: props.projectId,
      motivacion: formData.value.motivacion,
      disponibilidad: formData.value.disponibilidad,
      experiencia_relacionada: formData.value.experiencia_relacionada || null,
      // Incluir campos personalizados si existen
      ...(Object.keys(camposPersonalizados.value).length > 0 && {
        camposPersonalizados: Object.keys(camposPersonalizados.value).map(key => ({
          nombre_campo: key,
          valor: camposPersonalizados.value[key]
        }))
      })
    };

    // Recolectar todos los archivos
    const allFiles = [];
    
    // Archivos de campos tipo file
    Object.values(archivos.value).forEach(file => {
      if (file) {
        if (Array.isArray(file)) {
          allFiles.push(...file);
        } else {
          allFiles.push(file);
        }
      }
    });

    // Documentos generales
    if (documentosGenerales.value && documentosGenerales.value.length > 0) {
      allFiles.push(...documentosGenerales.value);
    }

    // Crear la solicitud
    await solicitudStore.createSolicitud(solicitudData, allFiles);

    notificationStore.showSnackbar('Solicitud enviada correctamente', 'success');
    emit('success');
    emit('submit', solicitudData);
  } catch (err) {
    console.error('Error submitting enrollment:', err);
    const errorMessage = err.response?.data?.message || err.message || 'Error al enviar la solicitud';
    error.value = errorMessage;
    notificationStore.showSnackbar(errorMessage, 'error');
    emit('error', err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.volunteer-enrollment-form {
  padding: 16px 0;
}
</style>

