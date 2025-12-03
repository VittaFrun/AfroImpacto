<template>
  <v-card class="mb-6" elevation="2" rounded="lg">
    <v-card-text class="pa-4">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="localFilters.search"
            label="Buscar organizaciones"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-magnify"
            clearable
            @update:model-value="updateFilters"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            v-model="localFilters.tipo"
            :items="organizationTypes"
            label="Tipo"
            variant="outlined"
            density="comfortable"
            clearable
            @update:model-value="updateFilters"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="localFilters.pais"
            :items="countries"
            label="País"
            variant="outlined"
            density="comfortable"
            clearable
            @update:model-value="updateFilters"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="localFilters.areaEnfoque"
            :items="focusAreas"
            label="Área de Enfoque"
            variant="outlined"
            density="comfortable"
            clearable
            @update:model-value="updateFilters"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      search: '',
      tipo: null,
      pais: null,
      areaEnfoque: null
    })
  }
});

const emit = defineEmits(['update:filters']);

const localFilters = ref({ ...props.filters });

const organizationTypes = [
  'ONG',
  'Fundación',
  'Asociación',
  'Cooperativa',
  'Corporación',
  'Empresa Social',
  'Gobierno',
  'Universidad'
];

const countries = [
  'Colombia', 'México', 'Argentina', 'Chile', 'Perú', 'Ecuador',
  'Venezuela', 'Bolivia', 'Uruguay', 'Paraguay', 'Brasil',
  'Estados Unidos', 'España', 'Otro'
];

const focusAreas = [
  'Educación', 'Tecnología', 'Salud', 'Ambiente', 'Emprendimiento',
  'Desarrollo Comunitario', 'Derechos Humanos', 'Arte y Cultura',
  'Deportes', 'Alimentación', 'Vivienda', 'Empleo'
];

function updateFilters() {
  emit('update:filters', { ...localFilters.value });
}

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters };
}, { deep: true });
</script>

