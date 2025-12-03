<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="beneficio ? 'Editar Beneficios' : 'Configurar Beneficios'"
    icon="mdi-cash-multiple"
    max-width="700px"
  >
    <template #content>
      <v-form>
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="localForm.tipo_pago"
              :items="[
                { title: 'Voluntariado (Sin remuneración)', value: 'volunteer' },
                { title: 'Estipendio', value: 'stipend' },
                { title: 'Salario', value: 'salary' },
                { title: 'Honorario', value: 'honorarium' },
                { title: 'Comisión', value: 'commission' },
                { title: 'Bono', value: 'bonus' }
              ]"
              label="Tipo de Remuneración"
              variant="outlined"
              prepend-inner-icon="mdi-cash-multiple"
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="localForm.frecuencia"
              :items="[
                { title: 'Sin frecuencia', value: 'none' },
                { title: 'Por hora', value: 'hourly' },
                { title: 'Diario', value: 'daily' },
                { title: 'Semanal', value: 'weekly' },
                { title: 'Mensual', value: 'monthly' },
                { title: 'Por proyecto', value: 'project' }
              ]"
              label="Frecuencia de Pago"
              variant="outlined"
              prepend-inner-icon="mdi-calendar-clock"
              :disabled="localForm.tipo_pago === 'volunteer'"
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="6" v-if="localForm.tipo_pago !== 'volunteer'">
            <v-text-field
              v-model.number="localForm.monto"
              label="Monto"
              type="number"
              variant="outlined"
              prefix="$"
              suffix="COP"
              min="0"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-textarea
              v-model="localForm.descripcion_pago"
              label="Descripción del Pago"
              variant="outlined"
              rows="3"
              placeholder="Describe los detalles de la remuneración..."
            ></v-textarea>
          </v-col>
          
          <v-col cols="12">
            <v-divider class="my-2"></v-divider>
            <p class="text-subtitle-2 mb-2">Beneficios Adicionales</p>
            
            <v-checkbox
              v-model="localForm.incluye_transporte"
              label="Incluye Transporte"
              color="success"
              hide-details
            ></v-checkbox>
            
            <v-checkbox
              v-model="localForm.incluye_alimentacion"
              label="Incluye Alimentación"
              color="success"
              hide-details
            ></v-checkbox>
            
            <v-checkbox
              v-model="localForm.incluye_materiales"
              label="Incluye Materiales de Trabajo"
              color="success"
              hide-details
            ></v-checkbox>
            
            <v-checkbox
              v-model="localForm.incluye_seguro"
              label="Incluye Seguro de Accidentes"
              color="success"
              hide-details
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template #actions>
      <ModernButton
        color="grey"
        variant="outlined"
        @click="$emit('update:modelValue', false)"
        :disabled="loading"
      >
        Cancelar
      </ModernButton>
      <ModernButton
        color="success"
        variant="flat"
        @click="handleSave"
        :loading="loading"
      >
        Guardar
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  beneficio: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const localForm = ref({
  tipo_pago: 'volunteer',
  monto: 0,
  frecuencia: 'none',
  descripcion_pago: '',
  incluye_transporte: false,
  incluye_alimentacion: false,
  incluye_materiales: false,
  incluye_seguro: false
});

watch(() => props.beneficio, (newBeneficio) => {
  if (newBeneficio) {
    localForm.value = {
      tipo_pago: newBeneficio.tipo_pago || 'volunteer',
      monto: newBeneficio.monto || 0,
      frecuencia: newBeneficio.frecuencia || 'none',
      descripcion_pago: newBeneficio.descripcion_pago || '',
      incluye_transporte: newBeneficio.incluye_transporte || false,
      incluye_alimentacion: newBeneficio.incluye_alimentacion || false,
      incluye_materiales: newBeneficio.incluye_materiales || false,
      incluye_seguro: newBeneficio.incluye_seguro || false
    };
  } else {
    localForm.value = {
      tipo_pago: 'volunteer',
      monto: 0,
      frecuencia: 'none',
      descripcion_pago: '',
      incluye_transporte: false,
      incluye_alimentacion: false,
      incluye_materiales: false,
      incluye_seguro: false
    };
  }
}, { immediate: true });

const handleSave = () => {
  emit('save', { ...localForm.value });
};
</script>

