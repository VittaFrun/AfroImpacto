<template>
  <div class="payment-configuration">
    <h3 class="section-title">
      <v-icon class="mr-2" color="success">mdi-cash-multiple</v-icon>
      Configuración de Remuneración
    </h3>
    
    <div class="payment-form">
      <!-- Payment Type -->
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="paymentData.paymentType"
            :items="paymentTypeOptions"
            label="Tipo de Remuneración"
            variant="outlined"
            prepend-icon="mdi-cash-multiple"
            required
            density="comfortable"
            color="primary"
            @update:model-value="onPaymentTypeChange"
          />
        </v-col>
        
        <v-col cols="12" md="6">
          <v-select
            v-model="paymentData.paymentFrequency"
            :items="paymentFrequencyOptions"
            label="Frecuencia de Pago"
            variant="outlined"
            prepend-icon="mdi-calendar-clock"
            :disabled="paymentData.paymentType === 'volunteer'"
            density="comfortable"
            color="primary"
          />
        </v-col>
      </v-row>

      <!-- Payment Amount -->
      <v-row v-if="paymentData.paymentType !== 'volunteer'">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="paymentData.paymentAmount"
            label="Monto de Remuneración"
            variant="outlined"
            prepend-icon="mdi-currency-usd"
            type="number"
            :min="0"
            :step="1000"
            :suffix="getPaymentFrequencySuffix()"
            density="comfortable"
            color="primary"
            @input="formatPaymentAmount"
          />
        </v-col>
        
        <v-col cols="12" md="6">
          <v-textarea
            v-model="paymentData.paymentDescription"
            label="Descripción de la Remuneración"
            variant="outlined"
            :rows="3"
            placeholder="Describe los detalles del pago, condiciones, etc."
            density="comfortable"
            color="primary"
            auto-grow
          />
        </v-col>
      </v-row>

      <!-- Benefits Checkboxes -->
      <div class="benefits-section">
        <h4 class="benefits-title">Beneficios Adicionales</h4>
        <v-row>
          <v-col cols="12" md="6">
            <v-checkbox
              v-model="paymentData.includesTransport"
              label="Transporte incluido"
              color="success"
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="paymentData.includesMeals"
              label="Alimentación incluida"
              color="success"
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="6">
            <v-checkbox
              v-model="paymentData.includesMaterials"
              label="Materiales de trabajo incluidos"
              color="success"
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="paymentData.includesInsurance"
              label="Seguro de accidentes incluido"
              color="success"
              hide-details
            ></v-checkbox>
          </v-col>
        </v-row>
      </div>

      <!-- Payment Preview -->
      <div v-if="paymentData.paymentType !== 'volunteer'" class="payment-preview">
        <h4 class="preview-title">Vista Previa de la Remuneración</h4>
        <div class="preview-card">
          <div class="preview-content">
            <div class="preview-type">
              <v-icon :color="getPaymentTypeColor(paymentData.paymentType)" size="24">
                {{ getPaymentTypeIcon(paymentData.paymentType) }}
              </v-icon>
              <span>{{ getPaymentTypeText(paymentData.paymentType) }}</span>
            </div>
            <div class="preview-amount">
              <span class="amount-value">${{ formatNumber(paymentData.paymentAmount || 0) }}</span>
              <span class="amount-frequency">{{ getPaymentFrequencyText(paymentData.paymentFrequency) }}</span>
            </div>
          </div>
          <div v-if="paymentData.paymentDescription" class="preview-description">
            {{ paymentData.paymentDescription }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      paymentType: 'volunteer',
      paymentAmount: 0,
      paymentFrequency: 'none',
      paymentDescription: '',
      includesTransport: false,
      includesMeals: false,
      includesMaterials: false,
      includesInsurance: false
    })
  }
});

const emit = defineEmits(['update:modelValue']);

const paymentData = ref({ ...props.modelValue });

const paymentTypeOptions = [
  { title: 'Voluntariado (Sin remuneración)', value: 'volunteer' },
  { title: 'Estipendio', value: 'stipend' },
  { title: 'Salario', value: 'salary' },
  { title: 'Honorario', value: 'honorarium' },
  { title: 'Comisión', value: 'commission' },
  { title: 'Bono', value: 'bonus' }
];

const paymentFrequencyOptions = [
  { title: 'Por hora', value: 'hourly' },
  { title: 'Diario', value: 'daily' },
  { title: 'Semanal', value: 'weekly' },
  { title: 'Mensual', value: 'monthly' },
  { title: 'Por proyecto', value: 'project' }
];

// Watch for changes and emit updates
watch(paymentData, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  paymentData.value = { ...newValue };
}, { deep: true });

function onPaymentTypeChange() {
  if (paymentData.value.paymentType === 'volunteer') {
    paymentData.value.paymentAmount = 0;
    paymentData.value.paymentFrequency = 'none';
    paymentData.value.paymentDescription = 'Proyecto de voluntariado sin remuneración económica';
  } else {
    paymentData.value.paymentFrequency = paymentData.value.paymentFrequency || 'monthly';
  }
}

function formatPaymentAmount() {
  // Ensure the amount is a number
  if (paymentData.value.paymentAmount) {
    paymentData.value.paymentAmount = parseInt(paymentData.value.paymentAmount);
  }
}

function getPaymentFrequencySuffix() {
  const suffixes = {
    'hourly': '/hora',
    'daily': '/día',
    'weekly': '/semana',
    'monthly': '/mes',
    'project': '/proyecto'
  };
  return suffixes[paymentData.value.paymentFrequency] || '';
}

function getPaymentTypeText(paymentType) {
  const types = {
    'volunteer': 'Voluntariado',
    'stipend': 'Estipendio',
    'salary': 'Salario',
    'honorarium': 'Honorario',
    'commission': 'Comisión',
    'bonus': 'Bono'
  };
  return types[paymentType] || 'No especificado';
}

function getPaymentTypeIcon(paymentType) {
  const icons = {
    'volunteer': 'mdi-heart',
    'stipend': 'mdi-cash',
    'salary': 'mdi-bank',
    'honorarium': 'mdi-gift',
    'commission': 'mdi-percent',
    'bonus': 'mdi-star'
  };
  return icons[paymentType] || 'mdi-cash';
}

function getPaymentTypeColor(paymentType) {
  const colors = {
    'volunteer': 'grey',
    'stipend': 'success',
    'salary': 'primary',
    'honorarium': 'warning',
    'commission': 'info',
    'bonus': 'purple'
  };
  return colors[paymentType] || 'grey';
}

function getPaymentFrequencyText(frequency) {
  const frequencies = {
    'none': '',
    'hourly': '/hora',
    'daily': '/día',
    'weekly': '/semana',
    'monthly': '/mes',
    'project': '/proyecto'
  };
  return frequencies[frequency] || '';
}

function formatNumber(number) {
  return number.toLocaleString();
}
</script>

<style scoped>
.payment-configuration {
  margin-bottom: var(--afro-space-xl);
}

.section-title {
  font-size: var(--afro-text-lg);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-lg);
  display: flex;
  align-items: center;
}

.payment-form {
  background: var(--afro-surface);
  border-radius: var(--afro-radius-lg);
  border: 1px solid var(--afro-border);
  padding: var(--afro-space-lg);
}

.benefits-section {
  margin-top: var(--afro-space-lg);
  padding-top: var(--afro-space-lg);
  border-top: 1px solid var(--afro-border);
}

.benefits-title {
  font-size: var(--afro-text-base);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-md);
}

.payment-preview {
  margin-top: var(--afro-space-lg);
  padding-top: var(--afro-space-lg);
  border-top: 1px solid var(--afro-border);
}

.preview-title {
  font-size: var(--afro-text-base);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-md);
}

.preview-card {
  background: var(--afro-primary-50);
  border-radius: var(--afro-radius-md);
  padding: var(--afro-space-md);
  border: 1px solid var(--afro-primary-200);
}

.preview-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--afro-space-sm);
}

.preview-type {
  display: flex;
  align-items: center;
  gap: var(--afro-space-sm);
  font-weight: 600;
  color: var(--afro-text-primary);
}

.preview-amount {
  display: flex;
  align-items: baseline;
  gap: var(--afro-space-xs);
}

.amount-value {
  font-size: var(--afro-text-xl);
  font-weight: 700;
  color: var(--afro-success);
}

.amount-frequency {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
}

.preview-description {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 768px) {
  .preview-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--afro-space-sm);
  }
  
  .preview-amount {
    align-self: flex-end;
  }
}
</style>
