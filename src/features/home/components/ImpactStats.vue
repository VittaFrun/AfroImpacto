<template>
  <v-container fluid class="impact-stats-section py-12 py-md-16">
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="10" class="text-center">
        <h2 class="section-heading text-h4 text-sm-h3 text-md-h2 font-weight-bold mb-4">
          Nuestro <span class="text-secondary font-weight-bold mb-6">Impacto</span> en Cifras
        </h2>
        <p class="section-subtext text-body-1">
          Descubre cómo AfroImpacto está transformando vidas y comunidades.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="px-2 px-md-0">
      <v-col
        v-for="(stat, index) in statsData"
        :key="index"
        cols="12"
        md="4"
        lg="3"
        class="d-flex pa-md-4 pa-2"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            class="stat-card mx-auto w-100 rounded-xl pa-8 text-center"
            :elevation="isHovering ? 12 : 5"
            :style="{ transform: isHovering ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)' }"
          >
            <v-icon :size="stat.iconSize" :color="stat.iconColor" class="mb-4 icon-animate">{{ stat.icon }}</v-icon>
            <div class="stat-number font-weight-bold text-h4 text-sm-h3 text-md-h2 mb-2">
              {{ stat.value.toLocaleString() }}
            </div>
            <div class="stat-label text-subtitle-1 text-md-h6 font-weight-medium text-high-contrast">
              {{ stat.label }}
            </div>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useDisplay } from 'vuetify';

export default {
  name: 'ImpactStats',
  setup() {
    const { name } = useDisplay();
    return { displayBreakpoint: name };
  },
  data() {
    return {
      statsData: [
        { icon: 'mdi-chart-bar', iconSize: 64, iconColor: '#18b97e', value: 1000, label: 'Proyectos Activos' },
        { icon: 'mdi-account-group', iconSize: 64, iconColor: '#4EC7A5', value: 3000, label: 'Beneficiarios Impactados' },
        { icon: 'mdi-handshake', iconSize: 64, iconColor: '#3f51b5', value: 800, label: 'Voluntarios Activos' },
      ],
    };
  },
};
</script>

<style scoped>
/* Colores de la paleta (referencia):
    primary: #18b97e (Verde principal)
    secondary: #4EC7A5 (Verde secundario, más claro)
    accent: #3f51b5 (Azul para acentos)
*/

.impact-stats-section {
  background: linear-gradient(to top, #ffffff 20%, #fcfae9 100%); /* Degradado suave */
  padding-bottom: 100px; /* Mantener padding para balance visual */
}

.section-heading {
  color: #2c3e50;
  line-height: 1.2;
  letter-spacing: -0.8px !important;
  font-size: 3.2rem !important;
}

.section-subtext {
  color: #424242 !important;
  line-height: 1.8;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.15rem;
}

/* Tarjetas de estadísticas clave */
.stat-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(8px); /* Efecto glassmorphism */
  border-radius: 20px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08) !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 220px; /* Asegura una altura consistente */
}

.stat-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-5px) scale(1.02);
}

.stat-number {
  color: #2c3e50; /* Color oscuro para los números */
  line-height: 1.2;
  font-size: 2.8rem !important; /* Ajusta tamaño para impacto */
}

.stat-label {
  color: #555; /* Gris medio para las etiquetas */
  font-size: 1.1rem;
}

.icon-animate {
  animation: pulse 2.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); } /* Un poco menos agresivo */
}

/* Responsive Adjustments */
@media (max-width: 959px) { /* md breakpoint */
  .section-heading {
    font-size: 2.8rem !important;
  }
  .section-subtext {
    font-size: 1rem;
  }
  .stat-card {
    min-height: 200px;
  }
  .stat-number {
    font-size: 2.4rem !important;
  }
  .stat-label {
    font-size: 1rem;
  }
}

@media (max-width: 599px) { /* sm breakpoint (incluye xs) */
  .impact-stats-section {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  .section-heading {
    font-size: 2.2rem !important;
  }
  .section-subtext {
    font-size: 0.9rem;
  }
  .stat-card {
    min-height: 180px;
    padding: 24px;
  }
  .stat-number {
    font-size: 2rem !important;
  }
  .stat-label {
    font-size: 0.9rem;
  }
}
</style>