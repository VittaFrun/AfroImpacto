<template>
  <v-container id="get-involved" fluid class="user-types-section py-12 py-md-16">
    <v-row align="stretch" justify="center">
      <v-col cols="12" md="5" class="d-flex mb-8 mb-md-0">
        <v-card
          class="user-card volunteer-card pa-8 w-100 d-flex flex-column align-center justify-start"
          elevation="4"
          hover
          @click="goToRegister('voluntario')"
        >
          <v-icon size="56" color="primary" class="mb-5">mdi-handshake</v-icon>
          <div class="user-card-title font-weight-bold mb-3">Voluntariado</div>
          <div class="user-card-description text-center mb-6 flex-grow-1">
            <p>
              Únete a nuestra comunidad de voluntarios y ayuda a empoderar comunidades afro.
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
            class="user-action-btn mt-auto"
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
          class="user-card organization-card pa-8 w-100 d-flex flex-column align-center justify-start"
          elevation="4"
          hover
          @click="goToRegister('organizacion')"
        >
          <v-icon size="56" color="accent" class="mb-5">mdi-domain</v-icon>
          <div class="user-card-title font-weight-bold mb-3">Organización</div>
          <div class="user-card-description text-center mb-6 flex-grow-1">
            <p>
              Colabora con nosotros para impulsar el desarrollo sostenible en comunidades afro.
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
            class="user-action-btn mt-auto"
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
/* Colores de la paleta (referencia de AboutUs):
    primary: #18b97e (Verde principal)
    secondary: #4EC7A5 (Verde secundario, más claro)
    accent: #3f51b5 (Azul para acentos)
*/

.user-types-section {
  background: linear-gradient(to bottom, #ffffff 20%, #fcfae9 100%); /* Un fondo ligeramente más claro que el de las tarjetas */
  padding-bottom: 120px; /* Asegura un buen espacio en la parte inferior */
}

/* Estilo de las Tarjetas de Usuario */
.user-card {
  border-radius: 20px !important;
  background: #ffffff !important;
  transition: all 0.3s ease-in-out;
  min-height: 480px; /* Altura mínima para asegurar consistencia */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Distribuye el espacio entre los elementos */
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07) !important;
  position: relative; /* Para el borde lateral */
  overflow: hidden; /* Asegura que el borde lateral no se desborde */
}

.user-card:hover {
  transform: translateY(-8px) scale(1.005);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.15) !important;
}

.volunteer-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 100%;
  background-color: #18b97e; /* Primary color */
  border-radius: 20px 0 0 20px; /* Bordes redondeados solo a la izquierda */
}

.organization-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 100%;
  background-color: #3f51b5; /* Accent color */
  border-radius: 20px 0 0 20px;
}

.user-card-title {
  font-size: 2rem;
  color: #2c3e50;
  letter-spacing: -0.5px;
}

.user-card-description {
  color: #555;
  font-size: 1.05rem;
  line-height: 1.7;
  max-width: 90%; /* Limita el ancho del texto para mejor legibilidad */
}

.user-card-description p {
  margin-bottom: 10px; /* Espaciado entre párrafos de descripción */
}

/* Botón de Acción dentro de las Tarjetas */
.user-action-btn {
  background-color: #18b97e !important; /* Primary color */
  color: #fff !important;
  border-radius: 12px !important;
  min-height: 50px;
  font-size: 1.05rem !important;
  font-weight: bold !important;
  text-transform: none !important;
  box-shadow: 0 5px 15px rgba(24, 185, 126, 0.4) !important; /* Sombra sutil del primary */
  transition: all 0.3s ease;
}

.user-action-btn:hover {
  background: #fff !important;
  color: #18b97e !important; /* Texto primary en hover */
  box-shadow: 0 10px 25px rgba(24, 185, 126, 0.6) !important; /* Sombra más fuerte del primary en hover */
  transform: translateY(-3px);
}

/* Divisor Vertical */
.user-type-divider {
  height: 85%;
  border-color: #c6f1df !important; /* Un verde claro para la línea */
  width: 2px;
}

/* --- Responsive Adjustments --- */
@media (max-width: 959px) { /* md breakpoint */
  .user-card {
    min-height: auto; /* Permite que las tarjetas se adapten mejor en mobile */
    padding: 30px;
  }

  .user-card-title {
    font-size: 1.8rem;
  }

  .user-card-description {
    font-size: 1rem;
  }
  .user-action-btn {
    min-height: 45px;
    font-size: 1rem;
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
  }
  .user-card::before {
    width: 6px; /* Borde más delgado en mobile */
    border-radius: 16px 0 0 16px;
  }
  .user-card-title {
    font-size: 1.6rem;
  }
  .user-card-description {
    font-size: 0.95rem;
  }
}
</style>