<template>
  <v-container fluid class="testimonials-section py-12 py-md-16">
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="10" class="text-center">
        <h2 class="section-heading text-h4 text-sm-h3 text-md-h2 font-weight-bold mb-4">
          Lo que nuestros <span class="text-secondary font-weight-bold mb-6">Voluntarios y Beneficiarios</span> Opinan
        </h2>
        <p class="section-subtext text-body-1">
          Escucha las experiencias de quienes han sido parte de nuestra comunidad.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="px-md-0 px-2">
      <v-col cols="12" xl="10"> <v-carousel
          :show-arrows="displayBreakpoint !== 'xs'" hide-delimiters cycle
          interval="8000"
          :height="carouselHeight" class="testimonials-carousel rounded-xl elevation-10"
        >
          <template v-slot:prev="{ props }">
            <v-btn
              icon="mdi-chevron-left"
              variant="flat"
              color="primary"
              @click="props.onClick"
              class="carousel-arrow"
            ></v-btn>
          </template>
          <template v-slot:next="{ props }">
            <v-btn
              icon="mdi-chevron-right"
              variant="flat"
              color="primary"
              @click="props.onClick"
              class="carousel-arrow"
            ></v-btn>
          </template>

          <v-carousel-item
            v-for="(group, index) in groupedTestimonios"
            :key="index"
          >
            <v-row align="stretch" justify="center" class="fill-height pa-4">
              <v-col
                v-for="(t, i) in group"
                :key="i"
                cols="12"
                :sm="testimonialsPerSlide === 1 ? 12 : 6"
                :md="testimonialsPerSlide === 1 ? 12 : (testimonialsPerSlide === 2 ? 6 : 4)"
                :lg="testimonialsPerSlide === 1 ? 12 : (testimonialsPerSlide === 2 ? 6 : (testimonialsPerSlide === 3 ? 4 : 3))"
                class="d-flex"
              >
                <v-hover v-slot="{ isHovering, props }">
                  <v-card
                    v-bind="props"
                    class="testimonial-card mx-auto w-100 rounded-xl pa-6 d-flex flex-column"
                    :elevation="isHovering ? 12 : 5"
                    :style="{ transform: isHovering ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)' }"
                  >
                    <div class="d-flex align-center mb-4">
                      <v-avatar size="80" class="mr-4 testimonial-avatar">
                        <v-img :src="t.foto" alt="Foto de testimonio" />
                      </v-avatar>
                      <div class="text-left">
                        <p class="font-weight-bold mb-1 text-subtitle-1 text-high-contrast">{{ t.nombre }}</p>
                        <p class="text-caption text-medium-contrast">{{ t.rol }}</p>
                      </div>
                    </div>
                    <v-icon color="grey-lighten-1" size="48" class="testimonial-quote-icon">mdi-format-quote-open</v-icon>
                    <div class="testimonial-text text-body-1 text-left flex-grow-1">
                      “{{ t.texto }}”
                    </div>
                    </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useDisplay } from 'vuetify';

export default {
  name: 'Testimonials',
  setup() {
    const { name } = useDisplay();
    return { displayBreakpoint: name };
  },
  data() {
    return {
      testimonios: [
        {
          foto: 'https://randomuser.me/api/portraits/men/32.jpg',
          nombre: 'David Ospina',
          rol: 'Voluntario Activo',
          texto: 'Ser voluntario en estos proyectos ha sido una experiencia increíble. La dedicación y el impacto real que se logra en las comunidades afro son inspiradores.',
          rating: 5
        },
        {
          foto: 'https://randomuser.me/api/portraits/women/44.jpg',
          nombre: 'Sofía Romero',
          rol: 'Beneficiaria, Taller de Emprendimiento',
          texto: 'Gracias a AfroImpacto y los talleres de emprendimiento, he logrado impulsar mi negocio local y mejorar mi calidad de vida. ¡Una oportunidad que cambió todo!',
          rating: 4.5
        },
        {
          foto: 'https://randomuser.me/api/portraits/men/65.jpg',
          nombre: 'Carlos Gaviria',
          rol: 'Director ONG "Manos Amigas"',
          texto: 'La colaboración con AfroImpacto ha sido transformadora para nuestra organización. Su plataforma simplifica la gestión y nos permite llegar a más personas.',
          rating: 5
        },
        {
          foto: 'https://randomuser.me/api/portraits/women/55.jpg',
          nombre: 'Valentina Restrepo',
          rol: 'Estudiante, Programa de Refuerzo Académico',
          texto: 'Los talleres de refuerzo académico han sido muy útiles para mi desarrollo personal y profesional. Me siento más segura y motivada para mis estudios.',
          rating: 4
        },
        {
          foto: 'https://randomuser.me/api/portraits/men/12.jpg',
          nombre: 'Juan Esteban Vélez',
          rol: 'Líder Comunitario',
          texto: 'Recomiendo AfroImpacto a todos los que quieran hacer una diferencia. Su compromiso con las comunidades vulnerables es ejemplar y sus proyectos son muy efectivos.',
          rating: 5
        },
        {
          foto: 'https://randomuser.me/api/portraits/women/21.jpg',
          nombre: 'María Camila Rojas',
          rol: 'Madre de Familia',
          texto: 'Mi familia y yo estamos muy agradecidos por el apoyo recibido en salud y alimentación. Estas iniciativas han traído esperanza y un futuro mejor para nuestros hijos.',
          rating: 4.5
        },
      ]
    }
  },
  computed: {
    // Número de testimonios por slide basado en el breakpoint
    testimonialsPerSlide() {
      switch (this.displayBreakpoint) {
        case 'xs': return 1;
        case 'sm': return 1; // Para un mejor look en sm, solo 1 tarjeta
        case 'md': return 2;
        case 'lg': return 3;
        case 'xl': return 3;
        default: return 3;
      }
    },
    // Agrupa los testimonios para el carrusel
    groupedTestimonios() {
      const groups = [];
      const pps = this.testimonialsPerSlide;
      for (let i = 0; i < this.testimonios.length; i += pps) {
        groups.push(this.testimonios.slice(i, i + pps));
      }
      return groups;
    },
    // Calcula la altura del carrusel dinámicamente para evitar cortes y espacios vacíos
    carouselHeight() {
      switch (this.displayBreakpoint) {
        case 'xs': return 380; // Altura para una tarjeta en móvil
        case 'sm': return 380; // Altura para una tarjeta en sm
        case 'md': return 400; // Altura para dos tarjetas en md
        case 'lg': return 400; // Altura para tres tarjetas en lg
        case 'xl': return 400; // Altura para tres tarjetas en xl
        default: return 400;
      }
    }
  }
}
</script>

<style scoped>
/* Colores de la paleta (referencia):
    primary: #18b97e (Verde principal)
    secondary: #4EC7A5 (Verde secundario, más claro)
    accent: #3f51b5 (Azul para acentos)
*/

.testimonials-section {
  background: linear-gradient(to bottom, #ffffff 20%, #fcfae9 100%); /* Degradado suave */
  padding-bottom: 100px;
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

/* Carrusel de testimonios */
.testimonials-carousel {
  max-width: 100%; /* Ocupa todo el ancho de su v-col padre */
  margin: 0 auto;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12) !important;
  border-radius: 24px !important;
  background: none; /* Asegura que no tenga fondo propio el carrusel */
}

/* Flechas de navegación del carrusel */
.testimonials-carousel .v-window__controls {
  opacity: 1; /* Siempre visibles o más prominentes */
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%; /* Para controlar la posición de las flechas */
  display: flex;
  justify-content: space-between;
  padding: 0 16px; /* Padding para que las flechas no toquen los bordes */
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.carousel-arrow {
  background-color: rgba(255, 255, 255, 0.9) !important;
  color: #18b97e !important;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  width: 50px; /* Tamaño más grande para las flechas */
  height: 50px;
}

.carousel-arrow:hover {
  background-color: #18b97e !important;
  color: #fff !important;
  box-shadow: 0 4px 15px rgba(24, 185, 126, 0.5);
}

/* Delimitadores del carrusel (los puntos) */
.testimonials-carousel .v-carousel__controls {
  background: transparent !important; /* Quita el fondo gris */
  border: none !important;
  box-shadow: none !important;
  position: absolute;
  bottom: 20px; /* Posiciona los puntos abajo */
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 0;
}

.testimonials-carousel .v-carousel__controls .v-btn--icon {
  margin: 0 6px; /* Espacio entre los puntos */
}

.testimonials-carousel .v-carousel__controls .v-btn--icon .v-icon {
  font-size: 12px; /* Tamaño del punto */
  color: #c0c0c0 !important;
}

.testimonials-carousel .v-carousel__controls .v-btn--icon.v-btn--active .v-icon {
  color: #18b97e !important;
  font-size: 16px; /* Un poco más grande el activo */
}


/* Tarjetas de Testimonio */
.testimonial-card {
  background: rgba(255, 255, 255, 0.95) !important; /* Casi opaco para mejor legibilidad */
  backdrop-filter: blur(8px); /* Efecto glassmorphism */
  border-radius: 20px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08) !important;
  min-height: 300px; /* Altura mínima para asegurar consistencia */
  position: relative; /* Para posicionar el ícono de cita */
}

.testimonial-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-5px) scale(1.02);
}

.testimonial-avatar {
  border: 4px solid #18b97e; /* Borde primary para el avatar */
}

.text-high-contrast {
  color: #2c3e50 !important; /* Negro oscuro para nombres */
}

.text-medium-contrast {
  color: #555 !important; /* Gris medio para roles */
}

.testimonial-quote-icon {
  position: absolute;
  top: 15px;
  right: 20px;
  opacity: 0.2; /* Sutil */
  z-index: 0; /* Asegura que esté detrás del texto */
}

.testimonial-text {
  color: #333 !important;
  line-height: 1.8;
  font-style: italic; /* Cursiva para el testimonio */
  font-size: 1.05rem;
  z-index: 1; /* Asegura que el texto esté sobre el ícono de cita */
  padding-top: 10px; /* Espacio para el ícono de cita */
}

/* Responsive Adjustments */
@media (max-width: 1280px) { /* lg breakpoint y superiores */
  .testimonials-carousel {
    max-width: 100%;
  }
}

@media (max-width: 959px) { /* md breakpoint */
  .section-heading {
    font-size: 2.8rem !important;
  }
  .section-subtext {
    font-size: 1rem;
  }
  .testimonials-carousel {
    max-width: 700px; /* Ajuste para 2 tarjetas en MD */
  }
  .testimonial-card {
    min-height: 350px; /* Altura ajustada para 2 tarjetas */
  }
  .testimonial-avatar {
    size: 70px !important;
  }
  .testimonial-text {
    font-size: 1rem;
  }
  .carousel-arrow {
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 599px) { /* sm breakpoint (incluye xs) */
  .testimonials-section {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  .section-heading {
    font-size: 2.2rem !important;
  }
  .section-subtext {
    font-size: 0.9rem;
  }
  .testimonials-carousel {
    max-width: 400px; /* Ajuste para 1 tarjeta en SM/XS */
  }
  .testimonial-card {
    min-height: 320px; /* Altura ajustada para 1 tarjeta */
    padding: 24px;
  }
  .testimonial-avatar {
    size: 60px !important;
  }
  .testimonial-text {
    font-size: 0.95rem;
  }
  .testimonials-carousel .v-window__controls {
    display: none; /* Ocultar flechas en móviles pequeños si displayBreakpoint !== 'xs' es falso */
  }
}
</style>