<template>
  <v-container id="get-involved" fluid class="user-types-section py-12 py-md-16">
    <v-row align="stretch" justify="center" class="animate__animated animate__fadeInUp animate__delay-0.3s">
      <v-col cols="12" md="5" class="d-flex mb-8 mb-md-0">
        <v-card
          class="user-card volunteer-card pa-8 w-100 d-flex flex-column align-center text-center"
          elevation="8"
          hover
          @click="goToRegister('voluntario')"
          :ripple="true"
        >
          <div class="card-icon-wrapper mb-5">
            <v-icon size="64" color="primary">mdi-handshake</v-icon>
          </div>
          <h2 class="user-card-title font-weight-bold mb-3">Voluntariado</h2>
          <div class="user-card-description flex-grow-1">
            <p>
              Únete a nuestra comunidad de voluntarios y ayuda a empoderar comunidades.
            </p>
            <p class="mb-2">
              <span class="font-weight-bold text-primary">¿Qué puedes hacer?</span><br>
              Participa en proyectos educativos, talleres, mentorías y actividades de impacto social.
            </p>
            <p>
              <span class="font-weight-bold text-primary">¿Qué obtienes?</span><br>
              Crecimiento personal, formación, nuevas amistades y la satisfacción de transformar vidas.
            </p>
          </div>
          <v-btn
            block
            depressed
            class="user-action-btn primary-btn mt-auto"
            tabindex="-1"
          >
            Regístrate como voluntario
          </v-btn>
        </v-card>
      </v-col>

      <v-col cols="0" md="1" class="d-none d-md-flex justify-center align-center">
        <v-divider vertical class="user-type-divider"></v-divider>
      </v-col>

      <v-col cols="12" md="5" class="d-flex">
        <v-card
          class="user-card organization-card pa-8 w-100 d-flex flex-column align-center text-center"
          elevation="8"
          hover
          @click="goToRegister('organizacion')"
          :ripple="true"
        >
          <div class="card-icon-wrapper mb-5">
            <v-icon size="64" color="accent">mdi-domain</v-icon>
          </div>
          <h2 class="user-card-title font-weight-bold mb-3">Organización</h2>
          <div class="user-card-description flex-grow-1">
            <p>
              Colabora con nosotros para impulsar el desarrollo sostenible.
            </p>
            <p class="mb-2">
              <span class="font-weight-bold text-accent">¿Cómo puedes participar?</span><br>
              Presenta proyectos, accede a voluntarios, comparte recursos y fortalece tu red.
            </p>
            <p>
              <span class="font-weight-bold text-accent">¿Qué obtienes?</span><br>
              Visibilidad, alianzas, acceso a talento y apoyo para lograr mayor impacto social.
            </p>
          </div>
          <v-btn
            block
            depressed
            class="user-action-btn accent-btn mt-auto"
            tabindex="-1"
          >
            Regístrate como organización
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import 'animate.css'; // Importa Animate.css

export default {
  name: 'UserTypes',
  methods: {
    goToRegister(role) {
      this.$router.push({ path: '/register', query: { role: role } });
    }
  }
}
</script>

<style scoped>
/* Sección contenedora */
.user-types-section {
  background: linear-gradient(to bottom, #ffffff 20%, #fcfae9 100%); /* Fondo suave para contraste */
  padding-bottom: 100px;
}

/* Estilo base de las Tarjetas de Usuario */
.user-card {
  border-radius: 20px !important;
  background: #ffffff !important;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1); /* Transición global más suave y lenta */
  min-height: 520px; /* Aumenta ligeramente la altura mínima para más espacio */
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(0, 0, 0, 0.05); /* Borde sutil para definición */
  cursor: pointer;
}

.user-card:hover {
  transform: translateY(-12px) scale(1.02); /* Efecto de elevación y ligero crecimiento mejorado */
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.25) !important; /* Sombra más pronunciada al hover */
  border-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

/* Wrapper para el icono para un mejor control de espaciado */
.card-icon-wrapper {
  background-color: rgba(78, 199, 165, 0.1); /* Fondo sutil para el icono */
  border-radius: 50%;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.user-card:hover .card-icon-wrapper {
  background-color: rgba(78, 199, 165, 0.2);
  transform: scale(1.1); /* Icono crece ligeramente con la tarjeta */
}

/* Títulos de las tarjetas */
.user-card-title {
  font-size: 2.2rem;
  color: #2c3e50;
  letter-spacing: -0.8px;
  line-height: 1.2;
}

/* Descripción de las tarjetas */
.user-card-description {
  color: #555;
  font-size: 1.05rem;
  line-height: 1.7;
  max-width: 95%; /* Ligeramente más ancho */
  padding: 0 10px; /* Padding para el texto */
}

.user-card-description p {
  margin-bottom: 12px; /* Espaciado entre párrafos de descripción */
}

/* Botones de Acción dentro de las Tarjetas */
.user-action-btn {
  border-radius: 12px !important;
  min-height: 55px; /* Botones un poco más altos */
  font-size: 1.1rem !important; /* Texto ligeramente más grande */
  font-weight: bold !important;
  text-transform: none !important;
  letter-spacing: 0.5px;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.5, 1); /* Transición más robusta */
}

/* Estilos específicos para el botón principal (Voluntario) */
.primary-btn {
  background-color: #4ec7a5 !important; /* Usa el verde secundario para un contraste más suave */
  color: #fff !important;
  box-shadow: 0 6px 15px rgba(78, 199, 165, 0.4) !important;
}

.primary-btn:hover {
  background: #39b294 !important; /* Un verde un poco más oscuro al hover */
  color: #fff !important;
  box-shadow: 0 12px 28px rgba(78, 199, 165, 0.7) !important;
  transform: translateY(-5px); /* Efecto "lift" más pronunciado */
}

/* Estilos específicos para el botón de acento (Organización) */
.accent-btn {
  background-color: #3f51b5 !important; /* Mantiene el azul */
  color: #fff !important;
  box-shadow: 0 6px 15px rgba(63, 81, 181, 0.4) !important;
}

.accent-btn:hover {
  background: #33439e !important; /* Un azul un poco más oscuro al hover */
  color: #fff !important;
  box-shadow: 0 12px 28px rgba(63, 81, 181, 0.7) !important;
  transform: translateY(-5px);
}

/* Divisor Vertical */
.user-type-divider {
  height: 80%; /* Ajusta la altura del divisor */
  border-color: rgba(0, 0, 0, 0.1) !important; /* Un gris muy sutil para el divisor */
  width: 2px;
  opacity: 0.7;
}

/* --- Responsive Adjustments --- */
@media (max-width: 959px) { /* md breakpoint */
  .user-card {
    min-height: auto;
    padding: 30px;
    margin-bottom: 24px; /* Espacio entre tarjetas en móvil */
  }
  .user-card-title {
    font-size: 2rem;
  }
  .user-card-description {
    font-size: 1rem;
    padding: 0;
  }
  .user-action-btn {
    min-height: 50px;
    font-size: 1rem;
  }
  .user-types-section {
    padding-bottom: 80px; /* Ajuste para mobile */
  }
}

@media (max-width: 599px) { /* sm breakpoint */
  .user-types-section {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  .user-card {
    padding: 25px;
    border-radius: 16px !important;
    min-height: auto; /* Asegura adaptabilidad total */
  }
  .user-card-title {
    font-size: 1.8rem;
  }
  .user-card-description {
    font-size: 0.95rem;
  }
  .user-action-btn {
    min-height: 48px;
    font-size: 0.95rem;
  }
  .card-icon-wrapper {
    padding: 12px; /* Icono un poco más pequeño en móvil */
  }
}
</style>