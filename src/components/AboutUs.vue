<template>
  <section id="about-us" class="about-us-section py-16">
    <v-container id="about-us" fluid class="about-us-section py-12 py-md-16">
      <v-row align="center" justify="center" class="mb-12">
        <v-col cols="12" md="6" class="text-center text-md-left mb-8 mb-md-0 d-flex justify-center align-center">
          <v-img
            src="/src/components/icons/background_login.png"
            alt="Grupo de personas diversas sonriendo y colaborando, representando la inclusión"
            class="about-us-main-image rounded-xl elevation-6"
            max-width="70%"
            contain
          ></v-img>
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-left">
          <h2 class="section-heading text-h4 text-sm-h3 text-md-h2 font-weight-bold mb-6">
            Conoce a <span class="text-secondary font-weight-bold mb-6">Afro Impacto</span>
          </h2>
          <p class="section-subtext text-body-1 mb-6">
            Somos una plataforma apasionada dedicada a potenciar y amplificar las voces y proyectos de las comunidades afrodescendientes en Colombia y más allá. Conectamos talento, ideas y recursos para construir un futuro más equitativo y próspero.
          </p>
          <p class="section-subtext text-body-1 mb-8">
            Desde nuestra fundación, nos hemos comprometido a crear un ecosistema donde la colaboración y la innovación impulsen el desarrollo social, cultural y económico, visibilizando el inmenso impacto de la afrodescendencia.
          </p>
          <v-btn
            depressed
            large
            class="action-btn" href="/#contact"
          >
            Únete a la Causa
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row justify="center" align="stretch" class="my-14">
        <v-col cols="12" md="6" class="d-flex mb-6 mb-md-0">
          <v-card class="info-card mission-card flex-grow-1" elevation="8">
            <v-card-title class="d-flex align-center pb-2">
              <v-icon size="38" color="primary" class="mr-4 animate-icon-bounce">mdi-bullseye-arrow</v-icon>
              <span class="card-title-text font-weight-bold">Nuestra Misión</span>
            </v-card-title>
            <v-card-text class="card-description pt-0">
              Empoderar a las comunidades afrodescendientes, facilitando el acceso a recursos y oportunidades, y promoviendo su desarrollo integral a través de proyectos sostenibles y alianzas estratégicas.
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" class="d-flex">
          <v-card class="info-card vision-card flex-grow-1" elevation="8">
            <v-card-title class="d-flex align-center pb-2">
              <v-icon size="38" color="accent" class="mr-4 animate-icon-fade">mdi-eye-outline</v-icon>
              <span class="card-title-text font-weight-bold">Nuestra Visión</span>
            </v-card-title>
            <v-card-text class="card-description pt-0">
              Ser el referente global en la visibilización y el fortalecimiento de la identidad y el impacto afrodescendiente, construyendo una sociedad más inclusiva, justa y equitativa para todos.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row justify="center" class="mt-14">
        <v-col cols="12" md="10" class="text-center">
          <h3 class="section-heading-small font-weight-bold mb-10">
            Pilares de <span class="text-accent">Nuestros Valores</span>
          </h3>
          <div class="values-grid">
            <div class="value-item">
              <v-icon color="primary" size="44" class="mb-3 animate-icon-pop">mdi-account-multiple-check</v-icon>
              <div class="value-title">Inclusión</div>
              <p class="value-description">Creemos en un mundo donde todas las voces son valoradas y escuchadas.</p>
            </div>
            <div class="value-item">
              <v-icon color="accent" size="44" class="mb-3 animate-icon-pop">mdi-lightbulb-on-outline</v-icon>
              <div class="value-title">Innovación</div>
              <p class="value-description">Buscamos soluciones creativas y adaptables para los desafíos actuales.</p>
            </div>
            <div class="value-item">
              <v-icon color="secondary" size="44" class="mb-3 animate-icon-pop">mdi-handshake</v-icon>
              <div class="value-title">Colaboración</div>
              <p class="value-description">Fomentamos alianzas estratégicas para multiplicar nuestro impacto.</p>
            </div>
            <div class="value-item">
              <v-icon color="error" size="44" class="mb-3 animate-icon-pop">mdi-heart-plus</v-icon>
              <div class="value-title">Compromiso</div>
              <p class="value-description">Dedicación inquebrantable a nuestra misión y a las comunidades que servimos.</p>
            </div>
            <div class="value-item">
              <v-icon color="info" size="44" class="mb-3 animate-icon-pop">mdi-leaf</v-icon>
              <div class="value-title">Sostenibilidad</div>
              <p class="value-description">Diseñamos proyectos con impacto duradero y responsable.</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  name: 'AboutUs',
};
</script>

<style scoped>
/* Colores de la paleta:
    primary: #18b97e (Verde principal)
    secondary: #4EC7A5 (Verde secundario, más claro)
    accent: #3f51b5 (Azul para acentos, misión/visión)
    error: #e57373 (Rojo para compromiso/atención)
    info: #2196f3 (Azul para información/sostenibilidad)
*/

.about-us-section {
  background: linear-gradient(to top, #ffffff 20%, #fcfae9 100%);
  padding-top: 120px;
  padding-bottom: 120px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

/* Títulos y Subtítulos Generales de la Sección */
.section-heading {
  color: #2c3e50;
  line-height: 1.2;
  letter-spacing: -0.8px !important;
  font-size: 3.2rem !important;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.05); /* Sombra sutil para el título principal */
}

.section-heading-small {
  color: #2c3e50;
  font-size: 2.5rem !important;
  line-height: 1.3;
  letter-spacing: -0.5px !important;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.05); /* Sombra sutil para el título de valores */
}

.section-subtext {
  color: #424242 !important; /* Un gris más oscuro para mejor contraste */
  line-height: 1.8;
  max-width: 750px;
  margin-right: auto;
  font-size: 1.15rem;
}

/* Imagen Principal */
.about-us-main-image {
  max-width: 100%;
  height: auto;
  border: 6px solid rgba(255, 255, 255, 0.9);
  transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15) !important; /* Sombra un poco más suave */
  object-fit: contain;
}

.about-us-main-image:hover {
  transform: translateY(-10px) scale(1.01);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.25) !important; /* Sombra un poco más pronunciada en hover */
}

/* Botón de Acción - APLICACIÓN DE ESTILOS DE LOGIN/REGISTRO */
.action-btn {
  background-color: #4ec7a5 !important; /* Verde principal */
  color: #fff !important; /* Texto blanco */
  border-radius: 12px !important; /* Bordes redondeados */
  min-width: 200px; /* Ancho suficiente para "Únete a la Causa" */
  min-height: 55px; /* Altura generosa para mejor toque */
  font-size: 1.15rem !important; /* Tamaño de fuente ligeramente más grande */
  font-weight: bold !important; /* Texto en negrita */
  text-transform: none !important; /* Sin mayúsculas automáticas */
  box-shadow: 0 8px 20px rgba(78, 199, 165, 0.6) !important; /* Sombra prominente */
  letter-spacing: 0.8px; /* Espaciado entre letras */
  padding: 0 28px !important; /* Padding interno */
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  border: none !important; /* Sin borde por defecto de Vuetify */
}

.action-btn:hover {
  background: #fff !important; /* Fondo blanco en hover */
  color: #4ec7a5 !important; /* Texto verde en hover */
  box-shadow: 0 12px 28px rgba(78, 199, 165, 0.8) !important; /* Sombra más fuerte al hover */
  transform: translateY(-5px); /* Efecto de elevación */
}


/* Tarjetas de Misión y Visión */
.info-card {
  border-radius: 20px !important;
  background: #ffffff !important;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 35px;
  transition: box-shadow 0.3s, transform 0.3s;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08) !important; /* Sombra más pronunciada por defecto */
}

.info-card:hover {
  box-shadow: 0 25px 55px rgba(0, 0, 0, 0.2) !important; /* Sombra más fuerte al hover */
  transform: translateY(-10px) scale(1.01); /* Elevación más notoria */
}

.mission-card {
  border-left: 8px solid #18b97e; /* Usando el primary directamente */
}

.vision-card {
  border-left: 8px solid #3f51b5; /* Usando el accent directamente */
}

.card-title-text {
  font-size: 1.6rem !important;
  color: #2c3e50;
}

.card-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.7;
  margin-top: 10px;
}

/* Animaciones para iconos en tarjetas de Misión/Visión */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
.animate-icon-bounce:hover {
  animation: bounce 0.6s infinite alternate;
}

@keyframes fadeInScale {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-icon-fade {
  opacity: 0.8;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.animate-icon-fade:hover {
  opacity: 1;
  transform: scale(1.1);
}


/* Sección de Valores (Grid para una Fila Flexible) */
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 30px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  align-items: start;
  justify-content: center;
}

.value-item {
  background: #fdfdfd;
  border-radius: 20px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1) !important; /* Sombra más definida */
  padding: 35px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: box-shadow 0.25s, transform 0.25s;
  height: 100%;
  justify-content: flex-start;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05); /* Borde sutil para definición */
}

.value-item:hover {
  box-shadow: 0 20px 50px rgba(78, 199, 165, 0.4) !important; /* Sombra más fuerte al hover */
  transform: translateY(-8px) scale(1.02); /* Elevación más notoria */
}

.value-title {
  font-size: 1.45rem;
  color: #2c3e50;
  font-weight: 700;
  margin-top: 12px;
  margin-bottom: 8px;
}

.value-description {
  font-size: 0.98rem;
  color: #777;
  line-height: 1.6;
}

/* Animación para iconos en valores */
@keyframes popScale {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.animate-icon-pop:hover {
  animation: popScale 0.3s ease-out;
}

/* --- Responsive Adjustments --- */

@media (max-width: 1200px) {
  .values-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 25px;
  }
}

@media (max-width: 959px) {
  .about-us-section {
    padding-top: 90px;
    padding-bottom: 90px;
  }
  .section-heading {
    font-size: 2.8rem !important;
    text-align: center !important;
  }
  .section-heading-small {
    font-size: 2.2rem !important;
  }
  .section-subtext {
    text-align: center !important;
  }
  .action-btn {
    display: block;
    margin: 0 auto;
  }
  .info-card {
    padding: 30px;
    min-height: auto;
  }
  .card-title-text {
    font-size: 1.5rem !important;
  }
  .card-description {
    font-size: 1.05rem;
  }
  .values-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 25px;
  }
  .value-item {
    padding: 30px 20px;
  }
  .value-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 599px) {
  .about-us-section {
    padding-top: 70px;
    padding-bottom: 70px;
  }
  .section-heading {
    font-size: 2.2rem !important;
  }
  .section-heading-small {
    font-size: 1.8rem !important;
  }
  .section-subtext {
    font-size: 0.9rem;
  }
  .action-btn {
    font-size: 1rem;
    padding: 10px 25px !important;
  }
  .info-card {
    padding: 25px;
  }
  .card-title-text {
    font-size: 1.3rem !important;
  }
  .card-description {
    font-size: 0.95rem;
  }
  .values-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 10px;
  }
  .value-item {
    padding: 25px 15px;
  }
  .value-title {
    font-size: 1.2rem;
  }
  .value-description {
    font-size: 0.85rem;
  }
}
</style>