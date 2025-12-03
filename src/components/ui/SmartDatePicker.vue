<template>
  <div class="smart-date-picker">
    <!-- Date Input Field -->
    <v-text-field
      v-model="localValue"
      :label="label"
      :variant="variant"
      :density="density"
      :rules="computedRules"
      :error-messages="errorMessages"
      :hint="hint"
      :persistent-hint="persistentHint"
      :disabled="disabled"
      :readonly="readonly"
      type="date"
      :min="minDate"
      :max="maxDate"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <template #prepend-inner>
        <v-icon :color="iconColor">{{ icon }}</v-icon>
      </template>
      
      <template #append-inner>
        <v-menu
          v-if="showSuggestions && suggestions.length > 0"
          :close-on-content-click="false"
          location="bottom end"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-lightbulb"
              size="small"
              variant="text"
              color="warning"
              :title="suggestionsTooltip"
            />
          </template>
          
          <v-card min-width="280" max-width="400">
            <v-card-title class="text-subtitle-1 pb-2">
              <v-icon class="mr-2" color="warning">mdi-lightbulb</v-icon>
              Sugerencias
            </v-card-title>
            <v-card-text class="pt-0">
              <div
                v-for="(suggestion, index) in suggestions"
                :key="index"
                class="suggestion-item"
              >
                <v-btn
                  :text="suggestion.label"
                  :subtitle="suggestion.description"
                  variant="text"
                  class="justify-start pa-2 mb-1"
                  block
                  @click="applySuggestion(suggestion.value)"
                >
                  <template #prepend>
                    <v-icon size="small" :color="suggestion.color || 'primary'">
                      {{ suggestion.icon || 'mdi-calendar' }}
                    </v-icon>
                  </template>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
        
        <v-btn
          v-if="showClear && localValue"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="clearDate"
        />
      </template>
    </v-text-field>

    <!-- Validation Messages -->
    <div v-if="showValidation && (validationErrors.length > 0 || validationWarnings.length > 0)" class="validation-messages mt-2">
      <!-- Errors -->
      <v-alert
        v-for="(error, index) in validationErrors"
        :key="`error-${index}`"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-2"
      >
        <template #prepend>
          <v-icon size="small">mdi-alert-circle</v-icon>
        </template>
        {{ error }}
      </v-alert>

      <!-- Warnings -->
      <v-alert
        v-for="(warning, index) in validationWarnings"
        :key="`warning-${index}`"
        type="warning"
        variant="tonal"
        density="compact"
        class="mb-2"
      >
        <template #prepend>
          <v-icon size="small">mdi-alert</v-icon>
        </template>
        {{ warning }}
      </v-alert>
    </div>

    <!-- Conflicts Display -->
    <div v-if="showConflicts && conflicts.length > 0" class="conflicts-display mt-2">
      <v-alert
        type="info"
        variant="tonal"
        density="compact"
      >
        <template #prepend>
          <v-icon size="small">mdi-information</v-icon>
        </template>
        <div>
          <strong>Conflictos detectados:</strong>
          <ul class="mt-1 mb-0">
            <li v-for="conflict in conflicts" :key="conflict.id || conflict.nombre">
              {{ conflict.nombre || conflict.descripcion }}
              <span class="text-caption text-grey">
                ({{ formatDateRange(conflict.fecha_inicio, conflict.fecha_fin) }})
              </span>
            </li>
          </ul>
        </div>
      </v-alert>
    </div>

    <!-- Quick Actions -->
    <div v-if="showQuickActions" class="quick-actions mt-3">
      <v-chip-group>
        <v-chip
          v-for="action in quickActions"
          :key="action.key"
          size="small"
          variant="outlined"
          :color="action.color || 'primary'"
          @click="applyQuickAction(action)"
        >
          <v-icon start size="small">{{ action.icon }}</v-icon>
          {{ action.label }}
        </v-chip>
      </v-chip-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { DateValidationService } from './DateValidationService';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Fecha'
  },
  variant: {
    type: String,
    default: 'outlined'
  },
  density: {
    type: String,
    default: 'default'
  },
  rules: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  
  // Date constraints
  minDate: {
    type: String,
    default: null
  },
  maxDate: {
    type: String,
    default: null
  },
  
  // Smart features
  showSuggestions: {
    type: Boolean,
    default: true
  },
  showValidation: {
    type: Boolean,
    default: true
  },
  showConflicts: {
    type: Boolean,
    default: true
  },
  showQuickActions: {
    type: Boolean,
    default: true
  },
  showClear: {
    type: Boolean,
    default: true
  },
  
  // Validation data
  validationErrors: {
    type: Array,
    default: () => []
  },
  validationWarnings: {
    type: Array,
    default: () => []
  },
  conflicts: {
    type: Array,
    default: () => []
  },
  
  // Suggestions
  suggestions: {
    type: Array,
    default: () => []
  },
  
  // Appearance
  icon: {
    type: String,
    default: 'mdi-calendar'
  },
  iconColor: {
    type: String,
    default: 'primary'
  },
  
  // Behavior
  autoValidate: {
    type: Boolean,
    default: true
  },
  validateOnBlur: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'validation', 'focus', 'blur', 'suggestion-applied']);

// Reactive data
const localValue = ref(props.modelValue);
const isFocused = ref(false);

// Computed
const computedRules = computed(() => {
  const rules = [...props.rules];
  
  // Add automatic date validation rules if enabled
  if (props.autoValidate) {
    rules.push(...DateValidationService.createDateRules(props.minDate, props.maxDate, true));
  }
  
  return rules;
});

const errorMessages = computed(() => {
  if (props.showValidation) {
    return props.validationErrors;
  }
  return [];
});

const hint = computed(() => {
  if (props.validationWarnings.length > 0) {
    return props.validationWarnings[0];
  }
  return '';
});

const persistentHint = computed(() => {
  return props.validationWarnings.length > 0;
});

const suggestionsTooltip = computed(() => {
  return `${props.suggestions.length} sugerencia${props.suggestions.length !== 1 ? 's' : ''} disponible${props.suggestions.length !== 1 ? 's' : ''}`;
});

const quickActions = computed(() => {
  const actions = [];
  const today = new Date();
  
  // Today
  if (!props.minDate || new Date(props.minDate) <= today) {
    if (!props.maxDate || new Date(props.maxDate) >= today) {
      actions.push({
        key: 'today',
        label: 'Hoy',
        icon: 'mdi-calendar-today',
        color: 'primary',
        value: DateValidationService.formatDateForInput(today)
      });
    }
  }
  
  // Tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (!props.minDate || new Date(props.minDate) <= tomorrow) {
    if (!props.maxDate || new Date(props.maxDate) >= tomorrow) {
      actions.push({
        key: 'tomorrow',
        label: 'Mañana',
        icon: 'mdi-calendar-arrow-right',
        color: 'success',
        value: DateValidationService.formatDateForInput(tomorrow)
      });
    }
  }
  
  // Next week
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  if (!props.minDate || new Date(props.minDate) <= nextWeek) {
    if (!props.maxDate || new Date(props.maxDate) >= nextWeek) {
      actions.push({
        key: 'nextWeek',
        label: 'Próxima semana',
        icon: 'mdi-calendar-week',
        color: 'info',
        value: DateValidationService.formatDateForInput(nextWeek)
      });
    }
  }
  
  return actions;
});

// Methods
const handleFocus = (event) => {
  isFocused.value = true;
  emit('focus', event);
};

const handleBlur = (event) => {
  isFocused.value = false;
  
  if (props.validateOnBlur && localValue.value) {
    validateDate();
  }
  
  emit('blur', event);
};

const validateDate = () => {
  if (!localValue.value) return;
  
  // Emit validation event for parent to handle
  emit('validation', {
    date: localValue.value,
    isValid: isValidDate(localValue.value)
  });
};

const isValidDate = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  
  if (props.minDate && date < new Date(props.minDate)) return false;
  if (props.maxDate && date > new Date(props.maxDate)) return false;
  
  return true;
};

const applySuggestion = (value) => {
  localValue.value = value;
  emit('suggestion-applied', { value, type: 'suggestion' });
};

const applyQuickAction = (action) => {
  localValue.value = action.value;
  emit('suggestion-applied', { value: action.value, type: 'quick-action', action });
};

const clearDate = () => {
  localValue.value = '';
};

const formatDateRange = (startDate, endDate) => {
  const start = DateValidationService.formatDate(new Date(startDate));
  const end = DateValidationService.formatDate(new Date(endDate));
  return `${start} - ${end}`;
};

// Watchers
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue;
});

watch(localValue, (newValue) => {
  emit('update:modelValue', newValue);
  
  if (props.autoValidate && newValue) {
    validateDate();
  }
});

// Lifecycle
onMounted(() => {
  if (props.autoValidate && localValue.value) {
    validateDate();
  }
});
</script>

<style scoped>
.smart-date-picker {
  width: 100%;
}

.validation-messages {
  max-width: 100%;
}

.conflicts-display ul {
  padding-left: 16px;
}

.conflicts-display li {
  margin-bottom: 4px;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-item {
  width: 100%;
}

.suggestion-item .v-btn {
  height: auto;
  min-height: 40px;
  white-space: normal;
  text-align: left;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .quick-actions {
    justify-content: center;
  }
  
  .quick-actions .v-chip {
    font-size: 0.75rem;
  }
}
</style>

