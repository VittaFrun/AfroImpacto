<template>
  <v-card-text class="pa-8">
    <div class="d-flex align-center mb-6">
      <v-icon color="primary" size="28" class="mr-3">mdi-account-key</v-icon>
      <h2 class="text-h5 font-weight-bold">Información de Cuenta</h2>
    </div>
    
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          label="Correo Electrónico"
          v-model="account.email"
          type="email"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-email"
          :rules="[v => !!v || 'El email es requerido', v => /.+@.+\..+/.test(v) || 'Email inválido']"
          class="mb-4"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Teléfono"
          v-model="account.telefono"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-phone"
          class="mb-4"
        />
      </v-col>
      <v-col cols="12">
        <v-divider class="my-4" />
        <h3 class="text-h6 mb-4">Cambiar Contraseña</h3>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="Contraseña Actual"
          v-model="account.currentPassword"
          type="password"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-lock"
          class="mb-4"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="Nueva Contraseña"
          v-model="account.newPassword"
          type="password"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-lock-plus"
          :rules="[v => !v || v.length >= 8 || 'Mínimo 8 caracteres']"
          class="mb-4"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="Confirmar Contraseña"
          v-model="account.confirmPassword"
          type="password"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-lock-check"
          :rules="[v => v === account.newPassword || 'Las contraseñas no coinciden']"
          class="mb-4"
        />
      </v-col>
    </v-row>
    
    <v-divider class="my-6" />
    
    <div class="d-flex justify-end">
      <v-btn color="primary" variant="flat" @click="saveAccount" :loading="saving">
        <v-icon start>mdi-account-key</v-icon>
        Actualizar Cuenta
      </v-btn>
    </div>
  </v-card-text>
</template>

<script setup>
import { ref } from 'vue'

const saving = ref(false)

const account = ref({
  email: 'contacto@semillasdelsaber.org',
  telefono: '+57 300 123 4567',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

async function saveAccount() {
  if (account.value.newPassword && account.value.newPassword !== account.value.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }
  
  saving.value = true
  await new Promise(r => setTimeout(r, 1000))
  saving.value = false
  // Aquí iría la lógica de guardado real
}
</script>

