<template>
  <v-select
    v-model="localValue"
    :items="availableTransitions"
    :label="label"
    :variant="variant"
    :density="density"
    :disabled="disabled || availableTransitions.length === 0"
    :rules="rules"
    :hint="hint"
    :persistent-hint="!!hint"
    @update:model-value="handleChange"
  >
    <template #selection="{ item }">
      <div class="d-flex align-center">
        <v-icon :color="item.raw.color" size="small" class="mr-2">
          {{ item.raw.icon }}
        </v-icon>
        {{ item.raw.title }}
      </div>
    </template>
    
    <template #item="{ props, item }">
      <v-list-item v-bind="props">
        <template #prepend>
          <v-icon :color="item.raw.color" size="small">
            {{ item.raw.icon }}
          </v-icon>
        </template>
        <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
        <v-list-item-subtitle v-if="item.raw.subtitle">
          {{ item.raw.subtitle }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
    
    <template #no-data>
      <v-list-item>
        <v-list-item-title class="text-grey">
          No hay transiciones disponibles
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-select>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStates } from '@/composables/useStates';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },
  stateType: {
    type: String,
    required: true,
    validator: (value) => ['project', 'task', 'application', 'phase'].includes(value)
  },
  currentStateId: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    default: 'Cambiar estado'
  },
  variant: {
    type: String,
    default: 'outlined'
  },
  density: {
    type: String,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Array,
    default: () => []
  },
  hint: {
    type: String,
    default: ''
  },
  includeCurrentState: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'state-changed']);

// Composables
const { getValidTransitions, formatState } = useStates();

// Reactive data
const localValue = ref(props.modelValue);

// Computed
const availableTransitions = computed(() => {
  const transitions = getValidTransitions(props.stateType, props.currentStateId);
  const items = transitions.map(state => ({
    value: state.id,
    title: state.label,
    subtitle: `Cambiar a ${state.label}`,
    color: state.color,
    icon: state.icon
  }));

  // Incluir estado actual si se solicita
  if (props.includeCurrentState) {
    const currentState = formatState(props.stateType, props.currentStateId);
    items.unshift({
      value: props.currentStateId,
      title: `${currentState.label} (Actual)`,
      subtitle: 'Estado actual',
      color: currentState.color,
      icon: currentState.icon
    });
  }

  return items;
});

// Methods
const handleChange = (newValue) => {
  emit('update:modelValue', newValue);
  
  if (newValue && newValue !== props.currentStateId) {
    const newState = formatState(props.stateType, newValue);
    emit('state-changed', {
      from: props.currentStateId,
      to: newValue,
      fromState: formatState(props.stateType, props.currentStateId),
      toState: newState
    });
  }
};

// Watchers
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue;
});

watch(() => props.currentStateId, () => {
  // Reset selection when current state changes
  localValue.value = null;
  emit('update:modelValue', null);
});
</script>

<style scoped>
/* Add any specific styles if needed */
</style>
