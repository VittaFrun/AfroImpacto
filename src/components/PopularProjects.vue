<template>
  <v-container fluid class="mb-12">
    <h2 class="text-center font-weight-bold mb-8" style="font-size:2rem;">
      Proyectos más Populares
    </h2>
    <v-carousel
      v-model="slide"
      :cycle="true"
      :interval="5000"
      show-arrows
      hide-delimiters
      height="350"
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
            sm="4"
            class="d-flex"
          >
            <v-card elevation="2" class="mx-auto w-100" style="border-radius: 8px;  padding-top: 10px; padding-left: 10px; padding-right: 10px;">
              <v-img
                :src="p.img"
                height="180"
                cover
                class="rounded-t-lg"
                style="border-radius: 8px;"
              />
              <v-card-title class="font-weight-bold text-center">
                {{ p.titulo }}
              </v-card-title>
              <v-card-text class="text-center">
                {{ p.descripcion }}
              </v-card-text>
              <v-btn
              color="#4ec7a5"
              class="info-btn text-white font-weight-bold px-6"
              style="border-radius: 8px; text-transform: none; font-size: 1rem; margin-left: 200px;"
              depressed
            >
              Mas información
            </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
export default {
  name: 'PopularProjects',
  data() {
    return {
      slide: 0,
      proyectos: [
        {
          img: 'https://storage.googleapis.com/a1aa/image/f7825296-5787-4a5b-5105-d88aab27fd9c.jpg',
          titulo: 'Proyecto Educativo',
          descripcion: 'Fomentando la educación en comunidades afro mediante talleres y recursos.'
        },
        {
          img: 'https://storage.googleapis.com/a1aa/image/946050f4-c6b6-42e0-8219-f5bb1cd02ff6.jpg',
          titulo: 'Salud Comunitaria',
          descripcion: 'Proyectos de salud para mejorar el bienestar.'
        },
        {
          img: 'https://storage.googleapis.com/a1aa/image/8f5bee55-ff40-48bd-d1d4-b4172c5cca18.jpg',
          titulo: 'Emprendimiento Económico',
          descripcion: 'Iniciativas para fortalecer la economía local y el empleo.'
        },
        {
          img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
          titulo: 'Cultura y Arte',
          descripcion: 'Promoviendo la cultura afro a través de actividades artísticas y talleres.'
        },
        {
          img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
          titulo: 'Deporte y Recreación',
          descripcion: 'Fomentando el deporte y la recreación en comunidades vulnerables.'
        },
        {
          img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
          titulo: 'Tecnología para Todos',
          descripcion: 'Acercando la tecnología y la educación digital a jóvenes afrodescendientes.'
        },
        {
          img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
          titulo: 'Medioambiente',
          descripcion: 'Proyectos de reforestación y educación ambiental en comunidades afro.'
        },
        {
          img: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=400&q=80',
          titulo: 'Alimentación Saludable',
          descripcion: 'Huertos comunitarios y talleres de nutrición para familias afrodescendientes.'
        },
        {
          img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
          titulo: 'Mujeres Líderes',
          descripcion: 'Empoderamiento y formación para mujeres líderes en comunidades afro.'
        }
      ]
    }
  },
  computed: {
    groupedProjects() {
      // Agrupa los proyectos de a 3
      const groups = []
      for (let i = 0; i < this.proyectos.length; i += 3) {
        groups.push(this.proyectos.slice(i, i + 3))
      }
      return groups
    }
  }
}
</script>

<style scoped>
.info-btn:hover {
  background-color: #4ec7a5 !important;
  color: #fff !important;
  box-shadow: 0 4px 10px #4ec7a5 !important;
}
</style>