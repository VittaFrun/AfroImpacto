<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Invitar Miembro al Equipo"
    icon="mdi-email-send"
    max-width="600px"
  >
    <template #content>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="formData.email"
          label="Correo Electrónico"
          type="email"
          variant="outlined"
          prepend-inner-icon="mdi-email"
          :rules="[rules.required, rules.email]"
          class="mb-4"
        ></v-text-field>

        <v-select
          v-model="formData.id_rol_organizacion"
          :items="roleOptions"
          label="Rol a Asignar (Opcional)"
          variant="outlined"
          prepend-inner-icon="mdi-shield-account"
          item-title="title"
          item-value="value"
          clearable
          class="mb-4"
        ></v-select>

        <v-textarea
          v-model="formData.mensaje"
          label="Mensaje Personalizado (Opcional)"
          variant="outlined"
          rows="3"
          prepend-inner-icon="mdi-message-text"
          hint="Mensaje que se incluirá en la invitación"
          persistent-hint
        ></v-textarea>
      </v-form>
    </template>

    <template #actions>
      <ModernButton
        color="grey"
        variant="outlined"
        @click="$emit('update:modelValue', false)"
      >
        Cancelar
      </ModernButton>
      <ModernButton
        color="primary"
        variant="flat"
        :loading="loading"
        :disabled="!valid"
        @click="handleSend"
      >
        Enviar Invitación
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  organizationRoles: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'send']);

const form = ref(null);
const valid = ref(false);

const formData = ref({
  email: '',
  id_rol_organizacion: null,
  mensaje: ''
});

const rules = {
  required: (v) => !!v || 'Este campo es requerido',
  email: (v) => !v || /.+@.+\..+/.test(v) || 'Email inválido'
};

const roleOptions = computed(() => {
  return [
    { title: 'Sin rol (se asignará después)', value: null },
    ...props.organizationRoles.map(r => ({
      title: r.nombre || r.name,
      value: r.id_rol || r.id
    }))
  ];
});

function handleSend() {
  if (!valid.value) return;
  emit('send', { ...formData.value });
  formData.value = {
    email: '',
    id_rol_organizacion: null,
    mensaje: ''
  };
  emit('update:modelValue', false);
}
</script>

