<template>
  <v-menu
    :model-value="menu"
    @update:model-value="updateMenu"
    :close-on-content-click="false"
    transition="scale-transition"
    :offset-y="true"
    :offset-x="false"
    location="bottom"
    :min-width="400"
    :max-width="420"
    :z-index="1000"
  >
    <template v-slot:activator="{ props: menuProps }">
      <v-text-field
        :model-value="formattedDate"
        :label="label"
        variant="outlined"
        color="primary"
        :prepend-inner-icon="icon"
        class="modern-input date-input"
        density="comfortable"
        readonly
        :hint="hint"
        :persistent-hint="!!hint"
        :rules="rules"
        :error="!!error"
        :error-messages="error"
        v-bind="menuProps"
        hide-details="auto"
      >
        <template v-if="modelValue && showClear" v-slot:append-inner>
          <v-icon 
            color="error" 
            size="small"
            @click.stop="clearDate"
            class="cursor-pointer"
          >
            mdi-close-circle
          </v-icon>
        </template>
      </v-text-field>
    </template>
    <v-card class="corporate-date-picker" elevation="4">
      <!-- Calendar Grid -->
      <div class="corporate-picker-body">
        <v-date-picker
          :model-value="pickerValue"
          @update:model-value="handleDateChange"
          color="primary"
          locale="es"
          :min="min"
          :max="max"
          show-adjacent-months
          class="corporate-calendar"
        />
      </div>
      
      <!-- Footer with Selected Date and Confirm Button -->
      <div class="corporate-picker-footer">
        <div class="selected-date-text">
          <span class="date-label">{{ formattedSelectedDateFull || placeholder || 'Selecciona una fecha' }}</span>
        </div>
        <ModernButton
          color="primary"
          variant="text"
          size="small"
          @click="confirmDate"
          :disabled="!pickerValue"
          text="Confirmar"
        />
      </div>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ModernButton from './ModernButton.vue';

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: null
  },
  label: {
    type: String,
    default: 'Fecha'
  },
  icon: {
    type: String,
    default: 'mdi-calendar'
  },
  hint: {
    type: String,
    default: ''
  },
  rules: {
    type: Array,
    default: () => []
  },
  error: {
    type: String,
    default: ''
  },
  min: {
    type: String,
    default: null
  },
  max: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: 'Selecciona una fecha'
  },
  showClear: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

const menu = ref(false);
const pickerValue = ref(null);

// Format date for display in text field
const formattedDate = computed(() => {
  if (!props.modelValue) return '';
  try {
    const dateStr = typeof props.modelValue === 'string' 
      ? props.modelValue 
      : props.modelValue.toISOString().split('T')[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return '';
    const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    return `${dayName}, ${monthName} ${date.getDate()}`;
  } catch (e) {
    return '';
  }
});

// Format selected date for footer (full format)
const formattedSelectedDateFull = computed(() => {
  if (!pickerValue.value) return '';
  try {
    const dateStr = typeof pickerValue.value === 'string' 
      ? pickerValue.value 
      : pickerValue.value.toISOString().split('T')[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return '';
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  } catch (e) {
    return '';
  }
});

function updateMenu(value) {
  menu.value = value;
  if (value) {
    // Sync picker value when menu opens
    setTimeout(() => {
      if (props.modelValue) {
        const dateStr = typeof props.modelValue === 'string' 
          ? props.modelValue 
          : props.modelValue.toISOString().split('T')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          pickerValue.value = dateStr;
        } else {
          pickerValue.value = null;
        }
      } else {
        pickerValue.value = null;
      }
    }, 50);
  }
}

function handleDateChange(date) {
  if (date) {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    pickerValue.value = dateStr;
  }
}

function confirmDate() {
  if (pickerValue.value) {
    const dateStr = typeof pickerValue.value === 'string' 
      ? pickerValue.value 
      : pickerValue.value.toISOString().split('T')[0];
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      emit('update:modelValue', dateStr);
      menu.value = false;
    }
  }
}

function clearDate() {
  emit('update:modelValue', null);
  pickerValue.value = null;
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const dateStr = typeof newValue === 'string' 
      ? newValue 
      : newValue.toISOString().split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      pickerValue.value = dateStr;
    }
  } else {
    pickerValue.value = null;
  }
}, { immediate: true });
</script>

<style scoped>
/* Corporate Date Picker Styles - Clean White Design with Green Accent */
.corporate-date-picker {
  background: white !important;
  border-radius: 8px !important;
  overflow: hidden !important;
  min-width: 400px !important;
  max-width: 420px !important;
  width: 400px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  position: relative !important;
  z-index: 1000 !important;
  margin: 0 !important;
}

.corporate-picker-body {
  padding: 12px 16px !important;
  background: white !important;
  min-height: 300px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.corporate-calendar {
  width: 100% !important;
  max-width: 100% !important;
}

.corporate-calendar :deep(.v-date-picker-month) {
  padding: 0 8px !important;
  width: 100% !important;
  max-width: 100% !important;
}

.corporate-calendar :deep(.v-date-picker-month__week) {
  padding: 0 4px !important;
  width: 100% !important;
  margin: 0 !important;
}

.corporate-calendar :deep(.v-date-picker-month__weekday) {
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  color: #424242 !important;
  padding: 10px 4px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  width: calc(100% / 7) !important;
  text-align: center !important;
  overflow: visible !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
  margin: 0 !important;
}

.corporate-calendar :deep(.v-date-picker-month__day) {
  width: 42px !important;
  height: 42px !important;
  min-width: 42px !important;
  min-height: 42px !important;
  font-size: 0.875rem !important;
  color: #424242 !important;
  border-radius: 50% !important;
  margin: 3px !important;
  position: relative !important;
}

.corporate-calendar :deep(.v-date-picker-month__day:hover) {
  background: rgba(78, 199, 165, 0.1) !important;
  color: #424242 !important;
}

.corporate-calendar :deep(.v-date-picker-month__day--selected) {
  background: transparent !important;
  color: #424242 !important;
  font-weight: 700 !important;
  border: none !important;
  box-shadow: none !important;
}

/* Remove any background overlays that cause color superposition */
.corporate-calendar :deep(.v-date-picker-month__day--selected::before),
.corporate-calendar :deep(.v-date-picker-month__day--selected::after) {
  display: none !important;
}

.corporate-calendar :deep(.v-date-picker-month__day--today) {
  background: rgba(78, 199, 165, 0.08) !important;
  border: 1.5px solid #4EC7A5 !important;
  color: #424242 !important;
  font-weight: 600 !important;
}

/* Ensure today doesn't override selected style */
.corporate-calendar :deep(.v-date-picker-month__day--today.v-date-picker-month__day--selected) {
  background: transparent !important;
  border: none !important;
  color: #424242 !important;
  font-weight: 700 !important;
}

/* Turquoise accent for date picker header */
.corporate-calendar :deep(.v-date-picker-header) {
  color: #424242 !important;
}

.corporate-calendar :deep(.v-date-picker-header__btn) {
  color: #424242 !important;
}

.corporate-calendar :deep(.v-date-picker-header__btn:hover) {
  background: rgba(78, 199, 165, 0.1) !important;
}

.corporate-calendar :deep(.v-date-picker-month__day--adjacent) {
  color: #bdbdbd !important;
  opacity: 0.6 !important;
}

.corporate-picker-footer {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 12px 16px !important;
  background: white !important;
  border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
  position: relative !important;
  z-index: 1 !important;
}

.selected-date-text {
  flex: 1 !important;
}

.date-label {
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  color: #424242 !important;
}

.date-input {
  cursor: pointer !important;
}

.date-input :deep(.v-field) {
  cursor: pointer !important;
}

.date-input :deep(.v-field--focused) {
  border-color: #4caf50 !important;
}

.cursor-pointer {
  cursor: pointer !important;
}

/* Ensure v-menu content doesn't overlap */
:deep(.v-menu__content) {
  z-index: 1000 !important;
  position: fixed !important;
}

:deep(.v-overlay__content) {
  z-index: 1000 !important;
}
</style>

