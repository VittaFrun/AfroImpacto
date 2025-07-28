<template>
  <v-container id="our-projects" fluid class="popular-projects-section py-12 py-md-16">
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="10" class="text-center">
        <h2 class="section-heading text-h4 text-sm-h3 text-md-h2 font-weight-bold mb-4">
          Nuestros <span class="text-secondary font-weight-bold mb-6">Proyectos Populares</span>
        </h2>
        <p class="section-subtext text-body-1">
          Inspírate con las iniciativas más destacadas y transformadoras de nuestra comunidad.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-8 px-4 px-md-0">
      <v-col cols="12" md="6" lg="5">
        <v-text-field
          v-model="search"
          label="Buscar proyectos por título, descripción o autor"
          prepend-inner-icon="mdi-magnify"
          clearable
          variant="solo-filled"
          class="search-input"
          hide-details
          flat
          rounded="lg"
        >
          <template v-slot:append-inner>
            <v-icon v-if="search" @click="search = ''" color="grey-darken-1" size="small">mdi-close-circle</v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="5" class="d-flex align-center justify-center justify-md-start flex-wrap">
        <v-chip-group
          v-model="selectedCategory"
          class="category-chip-group"
          column
          mandatory
        >
          <v-chip
            value=""
            color="secondary"
            variant="flat"
            size="large"
            class="ma-1 font-weight-bold"
            :class="{ 'chip-active': selectedCategory === '' }"
          >
            Todos
          </v-chip>
          <v-chip
            v-for="cat in categories"
            :key="cat"
            :value="cat"
            color="accent"
            variant="flat"
            size="large"
            class="ma-1 font-weight-bold"
            :class="{ 'chip-active': selectedCategory === cat }"
          >
            {{ cat }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-row justify="center" class="px-md-0 px-2">
      <v-col cols="12" xl="10"> <v-carousel
          v-model="slide"
          :cycle="true"
          :interval="7000"
          show-arrows="hover"
          hide-delimiters
          height="auto"
          class="projects-carousel rounded-xl elevation-10"
        >
          <v-carousel-item
            v-for="(group, i) in groupedProjects"
            :key="i"
          >
            <v-row align="stretch" justify="center" class="fill-height px-2 pb-4 pt-2"> <v-col
                v-for="(p, j) in group"
                :key="j"
                cols="12"
                :sm="projectsPerSlide === 1 ? 12 : 6"
                :md="projectsPerSlide === 1 ? 12 : (projectsPerSlide === 2 ? 6 : 4)"
                :lg="projectsPerSlide === 1 ? 12 : (projectsPerSlide === 2 ? 6 : (projectsPerSlide === 3 ? 4 : 3))"
                class="d-flex"
              >
                <v-hover v-slot="{ isHovering, props }">
                  <v-card
                    v-bind="props"
                    class="project-card mx-auto w-100 rounded-xl"
                    :elevation="isHovering ? 12 : 5"
                    :style="{ transform: isHovering ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)' }"
                    @click="viewProjectDetails(p.id)"
                  >
                    <v-img
                      :src="p.img"
                      height="180"
                      cover
                      class="rounded-t-xl"
                    >
                      <template #placeholder>
                        <v-skeleton-loader type="image" />
                      </template>
                      <v-badge
                        v-if="p.popular"
                        color="red-darken-1"
                        content="Popular"
                        offset-x="10"
                        offset-y="10"
                        class="ma-2 text-caption font-weight-bold"
                        inline
                        floating
                      />
                    </v-img>
                    <v-card-title class="project-title-text font-weight-bold text-center mt-2">
                      {{ p.titulo }}
                    </v-card-title>
                    <v-card-subtitle class="text-center mb-2 d-flex align-center justify-center px-2">
                      <v-avatar size="28" class="mr-2 border-primary-thin">
                        <v-img :src="p.avatar" />
                      </v-avatar>
                      <span class="text-caption text-grey-darken-2 font-weight-medium">{{ p.autor }}</span>
                      <v-chip class="ml-2" color="primary" variant="tonal" size="small">
                        {{ p.categoria }}
                      </v-chip>
                    </v-card-subtitle>
                    <v-card-text class="text-center px-4 text-body-2 text-grey-darken-1 flex-grow-1">
                      {{ p.descripcion }}
                    </v-card-text>
                    <v-card-actions class="justify-center mt-auto pb-4">
                      <v-btn
                        color="primary"
                        variant="flat"
                        class="project-details-btn"
                        tabindex="-1"
                      >
                        Más información
                        <v-icon right small>mdi-arrow-right</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-12">
      <v-col cols="auto">
        <v-btn
          color="primary"
          size="x-large"
          class="action-btn"
          @click="verMas"
        >
          Ver más proyectos
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useDisplay } from 'vuetify'; // Importa useDisplay

export default {
  name: 'PopularProjects',
  setup() {
    const { name } = useDisplay(); // Usa el hook useDisplay
    return { displayBreakpoint: name }; // Expone el breakpoint actual a la plantilla
  },
  data() {
    return {
      slide: 0,
      search: '',
      selectedCategory: '',
      proyectos: [
        {
          id: 1,
          img: 'https://storage.googleapis.com/a1aa/image/f7825296-5787-4a5b-5105-d88aab27fd9c.jpg',
          titulo: 'Empoderamiento Educativo para Niños Afro',
          descripcion: 'Fomentando la educación y el acceso a recursos digitales para niños y jóvenes afrodescendientes en comunidades rurales.',
          categoria: 'Educación',
          autor: 'Fundación Semillas del Saber',
          avatar: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
          popular: true
        },
        {
          id: 2,
          img: 'https://storage.googleapis.com/a1aa/image/946050f4-c6b6-42e0-8219-f5bb1cd02ff6.jpg',
          titulo: 'Salud y Bienestar en Comunidades Costeras',
          descripcion: 'Programas de atención primaria y promoción de hábitos saludables en zonas costeras con difícil acceso a servicios médicos.',
          categoria: 'Salud',
          autor: 'ONG Vitalidad Caribeña',
          avatar: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
          popular: true
        },
        {
          id: 3,
          img: 'https://storage.googleapis.com/a1aa/image/8f5bee55-ff40-48bd-d1d4-b4172c5cca18.jpg',
          titulo: 'Fomento al Emprendimiento Local Afro',
          descripcion: 'Capacitación, mentoría y acceso a mercados para pequeños negocios liderados por mujeres y jóvenes afrocolombianos.',
          categoria: 'Economía',
          autor: 'Red de Emprendedores Solidarios',
          avatar: 'https://randomuser.me/api/portraits/thumb/women/3.jpg',
          popular: false
        },
        {
          id: 4,
          img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
          titulo: 'Preservación de la Cultura Ancestral',
          descripcion: 'Talleres de danza, música y gastronomía tradicional para las nuevas generaciones, conservando el patrimonio afro.',
          categoria: 'Cultura',
          autor: 'Colectivo Raíces Vivas',
          avatar: 'https://randomuser.me/api/portraits/thumb/men/4.jpg',
          popular: false
        },
        {
          id: 5,
          img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
          titulo: 'Deporte para la Inclusión Juvenil',
          descripcion: 'Programas deportivos y recreativos para fomentar valores y habilidades sociales en niños y adolescentes.',
          categoria: 'Deporte',
          autor: 'Club Deportivo Esperanza',
          avatar: 'https://randomuser.me/api/portraits/thumb/women/5.jpg',
          popular: false
        },
        {
          id: 6,
          img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
          titulo: 'Alfabetización Digital para Adultos',
          descripcion: 'Clases y acceso a equipos para que adultos mayores y campesinos adquieran habilidades tecnológicas básicas.',
          categoria: 'Tecnología',
          autor: 'Iniciativa Digital Rural',
          avatar: 'https://randomuser.me/api/portraits/thumb/men/6.jpg',
          popular: false
        },
        {
          id: 7,
          img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
          titulo: 'Reforestación y Conservación del Manglar',
          descripcion: 'Jornadas de siembra y educación ambiental para proteger los ecosistemas de manglar esenciales para la comunidad.',
          categoria: 'Medioambiente',
          autor: 'Guardianes del Ecosistema',
          avatar: 'https://randomuser.me/api/portraits/thumb/women/7.jpg',
          popular: true
        },
        {
          id: 8,
          img: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80',
          titulo: 'Seguridad Alimentaria Familiar',
          descripcion: 'Implementación de huertos caseros y capacitación en prácticas agrícolas sostenibles para familias.',
          categoria: 'Alimentación',
          autor: 'Comunidad Sostenible',
          avatar: 'https://randomuser.me/api/portraits/thumb/men/8.jpg',
          popular: false
        },
        {
          id: 9,
          img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80',
          titulo: 'Liderazgo Femenino Afro',
          descripcion: 'Programa de formación y empoderamiento para mujeres afro que deseen asumir roles de liderazgo en sus comunidades.',
          categoria: 'Liderazgo',
          autor: 'Mujeres en Acción',
          avatar: 'https://randomuser.me/api/portraits/thumb/women/9.jpg',
          popular: true
        },
      ]
    }
  },
  computed: {
    categories() {
      const all = this.proyectos.map(p => p.categoria)
      return [...new Set(all)].sort()
    },
    filteredProjects() {
      let filtered = this.proyectos
      if (this.search) {
        const s = this.search.toLowerCase()
        filtered = filtered.filter(p =>
          p.titulo.toLowerCase().includes(s) ||
          p.descripcion.toLowerCase().includes(s) ||
          p.autor.toLowerCase().includes(s) ||
          p.categoria.toLowerCase().includes(s) // Permitir buscar por categoría
        )
      }
      if (this.selectedCategory) {
        filtered = filtered.filter(p => p.categoria === this.selectedCategory)
      }
      return filtered
    },
    // Calcula cuántos proyectos mostrar por slide basado en el breakpoint actual
    projectsPerSlide() {
      switch (this.displayBreakpoint) {
        case 'xs': return 1; // 1 card on extra small screens
        case 'sm': return 2; // 2 cards on small screens
        case 'md': return 2; // 2 cards on medium screens
        case 'lg': return 3; // 3 cards on large screens
        case 'xl': return 3; // 3 cards on extra large screens
        default: return 3;
      }
    },
    groupedProjects() {
      const groups = []
      const arr = this.filteredProjects
      const pps = this.projectsPerSlide; // Usa el valor reactivo
      for (let i = 0; i < arr.length; i += pps) {
        groups.push(arr.slice(i, i + pps))
      }
      return groups
    }
  },
  methods: {
    viewProjectDetails(projectId) {
      console.log('Viewing details for project:', projectId);
      // this.$router.push({ name: 'ProjectDetail', params: { id: projectId } });
    },
    verMas() {
      this.$router.push('/projects')
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

.popular-projects-section {
  background: linear-gradient(to top, #ffffff 20%, #fcfae9 100%); /* Fondo suave para que los elementos resalten */
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

/* Campo de búsqueda */
.search-input.v-text-field {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.search-input.v-text-field:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.search-input.v-text-field .v-input__control {
  border-radius: 12px !important;
}

/* Chips de Categorías */
.category-chip-group .v-chip {
  transition: all 0.2s ease;
  min-width: 80px;
  justify-content: center;
  padding: 0 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.category-chip-group .v-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.category-chip-group .v-chip.chip-active {
  background-color: #18b97e !important; /* Primary color para el activo */
  color: #fff !important;
  box-shadow: 0 4px 10px rgba(24, 185, 126, 0.4);
}

/* Carrusel de Proyectos */
.projects-carousel {
  /* Ocupa el 100% del ancho de su v-col padre (xl="10" que es el 83.33% del v-container) */
  max-width: 100%;
  margin: 0 auto;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12) !important;
  border-radius: 24px !important;
  background: none; /* Asegura que no tenga fondo propio el carrusel */
}

.projects-carousel .v-window__controls {
  opacity: 0.8;
}

.projects-carousel .v-window__prev,
.projects-carousel .v-window__next {
  color: #18b97e !important;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Tarjetas de Proyecto */
.project-card {
  background: #ffffff !important;
  border-radius: 20px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08) !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  cursor: pointer; /* Indica que la tarjeta es clickeable */
}

.project-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-5px) scale(1.02);
}

.project-image {
  border-radius: 20px 20px 0 0 !important;
}

.project-title-text {
  color: #2c3e50;
  font-size: 1.6rem !important;
  line-height: 1.3;
  padding-bottom: 0;
  white-space: normal;
  word-break: break-word;
  padding: 16px 16px 0 !important;
}

.border-primary-thin {
  border: 2px solid #18b97e;
}

.project-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
  padding: 0 16px 10px !important;
}

/* Botón "Más información" dentro de la tarjeta */
.project-details-btn {
  background-color: #18b97e !important;
  color: #fff !important;
  border-radius: 10px !important;
  min-width: 140px;
  min-height: 40px;
  font-size: 0.9rem !important;
  font-weight: bold !important;
  text-transform: none !important;
  box-shadow: 0 4px 10px rgba(24, 185, 126, 0.4) !important;
  transition: all 0.3s ease;
}

.project-details-btn:hover {
  background-color: #4EC7A5 !important;
  box-shadow: 0 6px 15px rgba(24, 185, 126, 0.6) !important;
  transform: translateY(-2px);
}

/* Botón "Ver más proyectos" principal */
.action-btn {
  background-color: #18b97e !important;
  color: #fff !important;
  border-radius: 14px !important;
  min-width: 250px;
  min-height: 55px;
  font-size: 1.15rem !important;
  font-weight: bold !important;
  text-transform: none !important;
  box-shadow: 0 8px 20px rgba(24, 185, 126, 0.6) !important;
  letter-spacing: 0.8px;
  padding: 0 28px !important;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  border: none !important;
}

.action-btn:hover {
  background: #fff !important;
  color: #18b97e !important;
  box-shadow: 0 12px 28px rgba(24, 185, 126, 0.8) !important;
  transform: translateY(-5px);
}

/* Responsive Adjustments */
@media (min-width: 1904px) { /* xl breakpoint */
  .projects-carousel {
    max-width: 1600px; /* Ancho máximo aún mayor para pantallas 4K+ */
  }
}

@media (max-width: 1280px) { /* lg breakpoint (customizado para el carrusel) */
  .projects-carousel {
    max-width: 100%; /* Ocupa todo el ancho del col padre */
  }
}

@media (max-width: 959px) { /* md breakpoint */
  .section-heading {
    font-size: 2.8rem !important;
  }
  .section-subtext {
    font-size: 1rem;
  }
  .search-input .v-label {
    font-size: 0.95rem; /* Ajusta el tamaño de la etiqueta */
  }
  .category-chip-group {
    justify-content: center !important; /* Centra los chips en pantallas pequeñas */
  }
  .projects-carousel {
    height: auto !important;
    max-width: 600px; /* Limita el ancho para 2 tarjetas por fila */
    padding-bottom: 20px;
  }
  .project-card {
    height: auto;
    min-height: 500px; /* Altura mínima para 2 tarjetas por fila en tablet */
  }
  .project-image {
    height: 160px;
  }
  .project-title-text {
    font-size: 1.5rem !important;
  }
  .project-description {
    font-size: 0.9rem;
  }
  .project-details-btn {
    min-height: 40px;
    font-size: 0.9rem !important;
  }
  .action-btn {
    min-width: 200px;
    min-height: 50px;
    font-size: 1rem !important;
  }
}

@media (max-width: 599px) { /* sm breakpoint (incluye xs) */
  .popular-projects-section {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  .section-heading {
    font-size: 2.2rem !important;
  }
  .section-subtext {
    font-size: 0.9rem;
  }
  .search-input {
    font-size: 0.9rem;
  }
  .category-chip-group .v-chip {
    font-size: 0.85rem !important;
    min-width: 70px;
    padding: 0 12px;
    height: 38px;
  }
  .projects-carousel {
    max-width: 400px; /* Limita el ancho para 1 tarjeta por fila */
    padding-bottom: 0;
  }
  .project-card {
    min-height: 480px; /* Altura mínima para 1 tarjeta por fila en móvil */
  }
  .project-image {
    height: 150px;
  }
  .project-title-text {
    font-size: 1.3rem !important;
  }
  .project-description {
    font-size: 0.85rem;
  }
  .project-details-btn {
    font-size: 0.8rem !important;
    min-width: 120px;
    min-height: 36px;
  }
  .action-btn {
    min-width: 180px;
    min-height: 45px;
    font-size: 0.95rem !important;
  }
}
</style>