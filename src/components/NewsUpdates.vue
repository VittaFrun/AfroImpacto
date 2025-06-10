<template>
  <v-container id="news-updates" fluid class="news-updates-section py-12 py-md-16">
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="10" class="text-center">
        <h2 class="section-heading text-h4 text-sm-h3 text-md-h2 font-weight-bold mb-4">
          Últimas <span class="text-primary font-weight-bold mb-6">Noticias</span> y Actualizaciones
        </h2>
        <p class="section-subtext text-body-1">
          Mantente al día con nuestros avances, eventos y logros más recientes.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="px-md-0 px-2">
      <v-col cols="12" xl="10">
        <v-carousel
          :show-arrows="displayBreakpoint !== 'xs'"
          hide-delimiters="false"
          cycle
          interval="6000"
          :height="carouselHeight"
          class="news-carousel rounded-xl elevation-10"
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
            v-for="(group, index) in groupedNoticias"
            :key="index"
          >
            <v-row align="stretch" justify="center" class="fill-height pa-4">
              <v-col
                v-for="(noticia, i) in group"
                :key="i"
                cols="12"
                :sm="noticiasPerSlide === 1 ? 12 : 6"
                :md="noticiasPerSlide === 1 ? 12 : (noticiasPerSlide === 2 ? 6 : 4)"
                :lg="noticiasPerSlide === 1 ? 12 : (noticiasPerSlide === 2 ? 6 : (noticiasPerSlide === 3 ? 4 : 3))"
                class="d-flex"
              >
                <v-hover v-slot="{ isHovering, props }">
                  <v-card
                    v-bind="props"
                    class="news-card mx-auto w-100 d-flex flex-column"
                    :elevation="isHovering ? 12 : 5"
                    :style="{ transform: isHovering ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)' }"
                  >
                    <v-img
                      :src="noticia.img"
                      height="210"
                      class="rounded-t-xl"
                      cover
                    />
                    <div class="pa-5 pb-4 flex-grow-1 d-flex flex-column">
                      <p class="news-date text-caption text-medium-contrast mb-2">{{ noticia.fecha }}</p>
                      <h3 class="news-title font-weight-bold text-h6 text-high-contrast mb-2">
                        {{ noticia.titulo }}
                      </h3>
                      <p class="news-description text-body-2 text-medium-contrast flex-grow-1">
                        {{ truncateDescription(noticia.descripcion, 120) }}
                      </p>
                      <v-btn
                        color="primary"
                        class="read-more-btn text-white font-weight-bold mt-4"
                        variant="flat"
                        rounded="lg"
                        :to="noticia.link"
                      >
                        Leer más
                      </v-btn>
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
  name: 'NewsUpdates',
  setup() {
    const { name } = useDisplay();
    return { displayBreakpoint: name };
  },
  data() {
    return {
      noticias: [
        {
          img: 'https://storage.googleapis.com/a1aa/image/310e377e-c401-4910-cc1b-6dba154b375e.jpg',
          titulo: 'Evento de Inclusión y Diversidad en la Comunidad Afro',
          descripcion: 'Únete a nuestro próximo evento para celebrar la diversidad cultural y promover la inclusión en las comunidades afrodescendientes. Habrá charlas, talleres y expresiones artísticas.',
          fecha: '15 de Mayo, 2025',
          link: '/noticias/evento-inclusion'
        },
        {
          img: 'https://storage.googleapis.com/a1aa/image/2c8e32d5-64cd-477a-ba07-6854233e0871.jpg',
          titulo: 'Nueva Alianza Estratégica para Expandir Nuestro Impacto',
          descripcion: 'Hemos formado una importante alianza con la Fundación Solidaridad Global para llegar a más beneficiarios y expandir nuestros programas educativos y de salud en zonas rurales.',
          fecha: '10 de Abril, 2025',
          link: '/noticias/nueva-alianza'
        },
        {
          img: 'https://storage.googleapis.com/a1aa/image/062439ab-009b-41db-ab1a-a9ab04918df5.jpg',
          titulo: 'Proyecto Destacado: Empoderamiento Económico Local',
          descripcion: 'Descubre cómo este proyecto está cambiando vidas al brindar capacitación y microcréditos a emprendedores locales en comunidades afro, fomentando el desarrollo económico sostenible.',
          fecha: '28 de Marzo, 2025',
          link: '/noticias/proyecto-empoderamiento'
        },
        {
          img: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80',
          titulo: 'Lanzamiento de Talleres Comunitarios de Habilidades Técnicas',
          descripcion: 'Iniciamos una nueva serie de talleres prácticos enfocados en habilidades técnicas como programación básica, diseño gráfico y reparación de electrodomésticos, para jóvenes y adultos.',
          fecha: '05 de Marzo, 2025',
          link: '/noticias/talleres-habilidades'
        },
        {
          img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80',
          titulo: 'Firma de Convenio Educativo con Instituciones Clave',
          descripcion: 'Firmamos un convenio marco con importantes universidades y centros de formación profesional para ofrecer becas y programas de mentoría a estudiantes afrodescendientes.',
          fecha: '20 de Febrero, 2025',
          link: '/noticias/convenio-educativo'
        },
        {
          img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
          titulo: 'Ampliación del Programa de Voluntariado Internacional',
          descripcion: 'Nuestro programa de voluntariado se expande a nuevos países de América Latina y África, buscando voluntarios comprometidos con la causa afrodescendiente a nivel global.',
          fecha: '10 de Febrero, 2025',
          link: '/noticias/voluntariado-internacional'
        },
        {
          img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
          titulo: 'AfroImpacto Galardonado con Premio a la Innovación Social',
          descripcion: 'Recibimos un prestigioso reconocimiento por nuestro enfoque innovador en la creación de proyectos que abordan desafíos sociales y económicos en las comunidades afro.',
          fecha: '01 de Febrero, 2025',
          link: '/noticias/premio-innovacion'
        },
        {
          img: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=800&q=80',
          titulo: 'Expansión Regional: Nuevas Oficinas en el Territorio Nacional',
          descripcion: 'Orgullosamente inauguramos nuevas oficinas en 3 regiones estratégicas del país para fortalecer nuestra presencia y ofrecer un apoyo más cercano a las comunidades locales.',
          fecha: '25 de Enero, 2025',
          link: '/noticias/expansion-regional'
        },
        {
          img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
          titulo: 'Lanzamiento del Programa de Becas "Futuro Brillante Afro"',
          descripcion: 'Conoce nuestro nuevo programa de becas diseñado para apoyar a jóvenes talentos afrodescendientes en su camino hacia la educación superior y el desarrollo profesional.',
          fecha: '10 de Enero, 2025',
          link: '/noticias/programa-becas'
        }
      ]
    }
  },
  computed: {
    // Número de noticias por slide basado en el breakpoint
    noticiasPerSlide() {
      switch (this.displayBreakpoint) {
        case 'xs': return 1;
        case 'sm': return 1; // Para un mejor look en sm, solo 1 tarjeta
        case 'md': return 2;
        case 'lg': return 3;
        case 'xl': return 3;
        default: return 3;
      }
    },
    // Agrupa las noticias para el carrusel
    groupedNoticias() {
      const groups = [];
      const pps = this.noticiasPerSlide;
      for (let i = 0; i < this.noticias.length; i += pps) {
        groups.push(this.noticias.slice(i, i + pps));
      }
      return groups;
    },
    // Calcula la altura del carrusel dinámicamente
    carouselHeight() {
      switch (this.displayBreakpoint) {
        case 'xs': return 480; // Altura para una tarjeta en móvil
        case 'sm': return 480; // Altura para una tarjeta en sm
        case 'md': return 500; // Altura para dos tarjetas en md
        case 'lg': return 500; // Altura para tres tarjetas en lg
        case 'xl': return 500; // Altura para tres tarjetas en xl
        default: return 500;
      }
    }
  },
  methods: {
    truncateDescription(description, maxLength) {
      if (description.length <= maxLength) {
        return description;
      }
      return description.substring(0, maxLength) + '...';
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

.news-updates-section {
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

/* Carrusel de noticias */
.news-carousel {
  max-width: 100%;
  margin: 0 auto;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12) !important;
  border-radius: 24px !important;
  background: none;
}

/* Flechas de navegación del carrusel */
.news-carousel .v-window__controls {
  opacity: 1;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
}

.carousel-arrow {
  background-color: rgba(255, 255, 255, 0.9) !important;
  color: #18b97e !important;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  width: 50px;
  height: 50px;
}

.carousel-arrow:hover {
  background-color: #18b97e !important;
  color: #fff !important;
  box-shadow: 0 4px 15px rgba(24, 185, 126, 0.5);
}

/* Delimitadores del carrusel (los puntos) */
.news-carousel .v-carousel__controls {
  background: none !important;
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 0;
}

.news-carousel .v-carousel__controls .v-btn--icon {
  margin: 0 6px;
}

.news-carousel .v-carousel__controls .v-btn--icon .v-icon {
  font-size: 12px;
  color: #c0c0c0 !important;
}

.news-carousel .v-carousel__controls .v-btn--icon.v-btn--active .v-icon {
  color: #18b97e !important;
  font-size: 16px;
}

/* Tarjetas de Noticias */
.news-card {
  background: rgba(255, 255, 255, 0.95) !important; /* Efecto glassmorphism */
  backdrop-filter: blur(8px);
  border-radius: 20px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08) !important;
  min-height: 450px; /* Asegura una altura mínima consistente */
}

.news-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-5px) scale(1.02);
}

.news-card .v-img {
  border-radius: 16px 16px 0 0 !important; /* Bordes superiores de la imagen */
}

.news-date {
  color: #8a8a8a !important; /* Color más sutil para la fecha */
  font-size: 0.85rem;
}

.news-title {
  color: #2c3e50 !important; /* Color oscuro para títulos */
  line-height: 1.3;
}

.news-description {
  color: #555 !important; /* Gris medio para descripciones */
  line-height: 1.6;
}

.read-more-btn {
  font-size: 0.9rem !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  padding: 0 20px !important;
  height: 40px !important;
  transition: all 0.3s ease;
}

.read-more-btn:hover {
  background-color: #4ec7a5 !important; /* Verde más oscuro al pasar el ratón */
  box-shadow: 0 4px 12px rgba(24, 185, 126, 0.4) !important;
}

/* Responsive Adjustments */
@media (max-width: 1280px) { /* lg breakpoint y superiores */
  .news-carousel {
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
  .news-card {
    min-height: 480px; /* Ajuste para 2 tarjetas en MD */
  }
  .news-title {
    font-size: 1.1rem !important;
  }
  .news-description {
    font-size: 0.9rem !important;
  }
  .carousel-arrow {
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 599px) { /* sm breakpoint (incluye xs) */
  .news-updates-section {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  .section-heading {
    font-size: 2.2rem !important;
  }
  .section-subtext {
    font-size: 0.9rem;
  }
  .news-carousel {
    max-width: 400px; /* Ajuste para 1 tarjeta en SM/XS */
  }
  .news-card {
    min-height: 420px; /* Altura ajustada para 1 tarjeta en móvil */
    padding-bottom: 24px;
  }
  .news-title {
    font-size: 1rem !important;
  }
  .news-description {
    font-size: 0.85rem !important;
  }
  .news-carousel .v-window__controls {
    display: none; /* Ocultar flechas en móviles pequeños */
  }
}
</style>