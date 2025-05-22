<template>
  <v-container fluid class="py-12 popular-projects-bg">
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <h2 class="font-weight-bold mb-2 display-1 gradient-text" style="font-size:32px;">
          Proyectos más Populares
        </h2>
        <p class="mb-6 text-h6" style="color:floralwhite">
          Inspírate con las iniciativas más destacadas de nuestra comunidad.
        </p>
      </v-col>
    </v-row>

    <!-- Búsqueda y Filtros -->
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Buscar proyectos"
          prepend-inner-icon="mdi-magnify"
          clearable
          variant="solo-filled"
          class="glass-input"
          hide-details
        />
      </v-col>
      <v-col cols="12" md="6" class="d-flex align-center justify-center flex-wrap">
        <v-chip-group
          v-model="selectedCategory"
          class="d-flex flex-wrap"
          column
          mandatory
        >
          <v-chip
            value=""
            color="secondary"
            variant="elevated"
            class="ma-1"
          >
            Todos
          </v-chip>
          <v-chip
            v-for="cat in categories"
            :key="cat"
            :value="cat"
            color="primary"
            variant="elevated"
            class="ma-1"
          >
            {{ cat }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <!-- Carrusel de Proyectos -->
    <v-carousel
      v-model="slide"
      :cycle="true"
      :interval="7000"
      show-arrows
      hide-delimiters
      height="410"
      class="mb-10"
    >
      <v-carousel-item
        v-for="(group, i) in groupedProjects"
        :key="i"
      >
        <v-row align="stretch" justify="center" class="fill-height">
          <v-col
            v-for="(p, j) in group"
            :key="j"
            cols="12"
            sm="6"
            md="4"
            class="d-flex"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                class="project-card glass-card mx-auto w-100"
                elevation="isHovering ? 10 : 3"
                :style="{ transform: isHovering ? 'scale(1.03)' : 'scale(1)' }"
              >
                <v-img
                  :src="p.img"
                  height="160"
                  cover
                  class="rounded-t-lg"
                >
                  <template #placeholder>
                    <v-skeleton-loader type="image" />
                  </template>
                  <v-badge
                    v-if="p.popular"
                    color="deep-orange"
                    content="Popular"
                    offset-x="10"
                    offset-y="10"
                    class="ma-2"
                  />
                </v-img>
                <v-card-title class="font-weight-bold text-center mt-2">
                  {{ p.titulo }}
                </v-card-title>
                <v-card-subtitle class="text-center mb-2 d-flex align-center justify-center">
                  <v-avatar size="28" class="mr-2">
                    <v-img :src="p.avatar" />
                  </v-avatar>
                  <span class="text-caption text-grey-darken-1">{{ p.autor }}</span>
                  <v-chip class="ml-2" color="primary" variant="flat" size="x-small">
                    {{ p.categoria }}
                  </v-chip>
                </v-card-subtitle>
                <v-card-text class="text-center px-4">
                  {{ p.descripcion }}
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn
                    color="primary"
                    variant="elevated"
                    class="font-weight-bold px-5"
                    style="border-radius: 8px; text-transform: none;"
                  >
                    Más información
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>

    <!-- Botón Ver Más Proyectos -->
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn
          color="secondary"
          size="x-large"
          class="font-weight-bold px-10 py-5 ver-mas-btn"
          style="border-radius: 14px; text-transform: none; font-size: 1.1rem;"
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
export default {
  name: 'PopularProjects',
  data() {
    return {
      slide: 0,
      search: '',
      selectedCategory: '',
      proyectos: [
        {
          img: 'https://storage.googleapis.com/a1aa/image/f7825296-5787-4a5b-5105-d88aab27fd9c.jpg',
          titulo: 'Proyecto Educativo',
          descripcion: 'Fomentando la educación en comunidades afro mediante talleres y recursos.',
          categoria: 'Educación',
          autor: 'María López',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
          popular: true
        },
        {
          img: 'https://storage.googleapis.com/a1aa/image/946050f4-c6b6-42e0-8219-f5bb1cd02ff6.jpg',
          titulo: 'Salud Comunitaria',
          descripcion: 'Proyectos de salud para mejorar el bienestar.',
          categoria: 'Salud',
          autor: 'Juan Pérez',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
          popular: true
        },
        {
          img: 'https://storage.googleapis.com/a1aa/image/8f5bee55-ff40-48bd-d1d4-b4172c5cca18.jpg',
          titulo: 'Emprendimiento Económico',
          descripcion: 'Iniciativas para fortalecer la economía local y el empleo.',
          categoria: 'Economía',
          autor: 'Ana Torres',
          avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
          popular: false
        },
        {
          img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
          titulo: 'Cultura y Arte',
          descripcion: 'Promoviendo la cultura afro a través de actividades artísticas y talleres.',
          categoria: 'Cultura',
          autor: 'Carlos Ruiz',
          avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
          popular: false
        },
        {
          img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
          titulo: 'Deporte y Recreación',
          descripcion: 'Fomentando el deporte y la recreación en comunidades vulnerables.',
          categoria: 'Deporte',
          autor: 'Laura Gómez',
          avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
          popular: false
        },
        {
          img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
          titulo: 'Tecnología para Todos',
          descripcion: 'Acercando la tecnología y la educación digital a jóvenes afrodescendientes.',
          categoria: 'Tecnología',
          autor: 'Pedro Castillo',
          avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
          popular: false
        },
        {
          img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
          titulo: 'Medioambiente',
          descripcion: 'Proyectos de reforestación y educación ambiental en comunidades afro.',
          categoria: 'Medioambiente',
          autor: 'Sofía Martínez',
          avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
          popular: true
        },
        {
          img: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=400&q=80',
          titulo: 'Alimentación Saludable',
          descripcion: 'Huertos comunitarios y talleres de nutrición para familias afrodescendientes.',
          categoria: 'Salud',
          autor: 'Miguel Ángel',
          avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
          popular: false
        },
        {
          img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
          titulo: 'Mujeres Líderes',
          descripcion: 'Empoderamiento y formación para mujeres líderes en comunidades afro.',
          categoria: 'Liderazgo',
          autor: 'Isabel Fernández',
          avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
          popular: true
        },
        {
          img: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=400&q=80',
          titulo: 'Innovación Social',
          descripcion: 'Soluciones tecnológicas para problemas sociales en comunidades vulnerables.',
          categoria: 'Tecnología',
          autor: 'Diego Ramírez',
          avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
          popular: false
        },
        {
          img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
          titulo: 'Arte Urbano',
          descripcion: 'Proyectos de muralismo y arte público para embellecer barrios.',
          categoria: 'Cultura',
          autor: 'Valentina Ríos',
          avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
          popular: false
        },
        {
          img: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80',
          titulo: 'Reciclaje Comunitario',
          descripcion: 'Campañas de reciclaje y educación ambiental para jóvenes.',
          categoria: 'Medioambiente',
          autor: 'Javier Soto',
          avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
          popular: false
        }
      ]
    }
  },
  computed: {
    categories() {
      const all = this.proyectos.map(p => p.categoria)
      return [...new Set(all)]
    },
    filteredProjects() {
      let filtered = this.proyectos
      if (this.search) {
        const s = this.search.toLowerCase()
        filtered = filtered.filter(p =>
          p.titulo.toLowerCase().includes(s) ||
          p.descripcion.toLowerCase().includes(s)
        )
      }
      if (this.selectedCategory) {
        filtered = filtered.filter(p => p.categoria === this.selectedCategory)
      }
      return filtered
    },
    groupedProjects() {
      const groups = []
      const arr = this.filteredProjects
      for (let i = 0; i < arr.length; i += 3) {
        groups.push(arr.slice(i, i + 3))
      }
      return groups
    }
  },
  methods: {
    verMas() {
      this.$router.push('/projects')
    }
  }
}
</script>

<style scoped>
.glass-card {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31,38,135,0.12);
  transition: box-shadow 0.25s, transform 0.25s;
}

.glass-card:hover {
  box-shadow: 0 16px 40px 0 rgba(31,38,135,0.18) !important;
}

.glass-input {
  background: rgba(255,255,255,0.7) !important;
  border-radius: 12px;
  backdrop-filter: blur(6px);
}

.gradient-text {
  background:white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.ver-mas-btn {
  background-color: #4ec7a5 !important;
  color: #fff !important;
  border-radius: 12px !important;
  min-width: 120px;
  min-height: 44px;
  font-size: 1.05rem;
  font-weight: bold;
  text-transform: none;
  box-shadow: none !important;
  letter-spacing: 0.5px;
  margin-left: 8px;
  padding-bottom: 3px;
  transition: background 0.2s, color 0.2s;
}
.ver-mas-btn:hover {
  background: #fff !important;
  color: #4ec7a5 !important;
  box-shadow: 0 4px 10px #4ec7a5 !important;
}
</style>
