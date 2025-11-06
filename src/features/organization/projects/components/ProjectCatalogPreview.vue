<template>
  <div class="project-catalog-preview" v-if="project">
    <v-card elevation="0" class="mb-4">
      <v-img
        :src="project.coverImage || '/default-project.jpg'"
        height="200"
        cover
        class="text-white"
      >
        <v-card-title class="text-h5 font-weight-bold">
          {{ project.name }}
        </v-card-title>
      </v-img>

      <v-card-text>
        <div class="mb-4">
          <v-chip color="primary" class="mr-2">
            {{ project.organization?.nombre || 'Organización' }}
          </v-chip>
          <v-chip color="success" variant="tonal">
            {{ project.location }}
          </v-chip>
        </div>

        <p class="text-body-1 mb-4">{{ project.description }}</p>

        <div class="mb-4">
          <h4 class="text-subtitle-1 font-weight-bold mb-2">Objetivo</h4>
          <p class="text-body-2">{{ project.objective }}</p>
        </div>

        <v-divider class="my-4"></v-divider>

        <v-row>
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-2">
              <v-icon class="mr-2">mdi-calendar</v-icon>
              <span class="text-body-2">
                <strong>Fechas:</strong> {{ formatDateRange(project.startDate, project.endDate) }}
              </span>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-2">
              <v-icon class="mr-2">mdi-currency-usd</v-icon>
              <span class="text-body-2">
                <strong>Presupuesto:</strong> ${{ project.budget?.toLocaleString() || '0' }}
              </span>
            </div>
          </v-col>
        </v-row>

        <!-- Beneficios -->
        <div v-if="project.beneficio" class="mt-4">
          <h4 class="text-subtitle-1 font-weight-bold mb-2">Beneficios y Remuneración</h4>
          <v-card variant="tonal" color="success" class="pa-3 mb-2">
            <div class="d-flex align-center mb-2">
              <v-icon class="mr-2">mdi-cash-multiple</v-icon>
              <strong>{{ getTipoPagoText(project.beneficio.tipo_pago) }}</strong>
            </div>
            <div v-if="project.beneficio.monto > 0" class="text-body-2 mb-2">
              Monto: ${{ formatCurrency(project.beneficio.monto) }}
              <span v-if="project.beneficio.frecuencia !== 'none'">
                ({{ getFrecuenciaText(project.beneficio.frecuencia) }})
              </span>
            </div>
            <div v-if="project.beneficio.descripcion_pago" class="text-body-2">
              {{ project.beneficio.descripcion_pago }}
            </div>
            <div class="d-flex flex-wrap gap-2 mt-2">
              <v-chip v-if="project.beneficio.incluye_transporte" size="small">
                <v-icon start size="small">mdi-bus</v-icon>
                Transporte
              </v-chip>
              <v-chip v-if="project.beneficio.incluye_alimentacion" size="small">
                <v-icon start size="small">mdi-food</v-icon>
                Alimentación
              </v-chip>
              <v-chip v-if="project.beneficio.incluye_materiales" size="small">
                <v-icon start size="small">mdi-toolbox</v-icon>
                Materiales
              </v-chip>
              <v-chip v-if="project.beneficio.incluye_seguro" size="small">
                <v-icon start size="small">mdi-shield-check</v-icon>
                Seguro
              </v-chip>
            </div>
          </v-card>
        </div>

        <!-- Requisitos -->
        <div v-if="project.requisitos" class="mt-4">
          <h4 class="text-subtitle-1 font-weight-bold mb-2">Requisitos</h4>
          <v-card variant="tonal" color="info" class="pa-3">
            <div class="text-body-2" style="white-space: pre-line;">
              {{ project.requisitos }}
            </div>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return 'Fechas no especificadas';
  const start = new Date(startDate).toLocaleDateString('es-CO');
  const end = new Date(endDate).toLocaleDateString('es-CO');
  return `${start} - ${end}`;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('COP', '').trim();
}

function getTipoPagoText(tipo) {
  const tipos = {
    'volunteer': 'Voluntariado',
    'stipend': 'Estipendio',
    'salary': 'Salario',
    'honorarium': 'Honorarios'
  };
  return tipos[tipo] || tipo;
}

function getFrecuenciaText(frecuencia) {
  const frecuencias = {
    'none': 'Sin frecuencia',
    'monthly': 'Mensual',
    'weekly': 'Semanal',
    'project': 'Por proyecto'
  };
  return frecuencias[frecuencia] || frecuencia;
}
</script>

<style scoped>
.project-catalog-preview {
  max-height: 70vh;
  overflow-y: auto;
}
</style>

