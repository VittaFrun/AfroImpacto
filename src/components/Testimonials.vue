<template>
  <div>
    <v-container fluid class="py-8">
      <h3 class="text-center font-weight-bold mb-8 titulo" style="font-size:32px;">Testimonios</h3>
      <v-carousel
        show-arrows
        hide-delimiters
        height="260"
        :cycle="false"
      >
        <v-carousel-item
          v-for="(group, index) in groupedTestimonios"
          :key="index"
        >
          <v-row class="fill-height" align="stretch" justify="center">
            <v-col
              v-for="(t, i) in group"
              :key="i"
              cols="12"
              sm="4"
              class="d-flex"
            >
              <v-card
                elevation="2"
                class="pa-6 d-flex flex-column align-center w-100"
                style="background: #fff; border-radius: 14px; min-height: 200px;"
              >
                <v-avatar size="70" class="mb-4">
                  <v-img :src="t.foto" />
                </v-avatar>
                <div
                  class="text-left font-weight-bold"
                  style="font-size:1.1rem; color:#222; min-height: 60px;"
                >
                  “{{ t.texto }}”
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Testimonials',
  data() {
    return {
      testimonios: [
        {
          foto: 'https://randomuser.me/api/portraits/men/32.jpg',
          texto: 'Ser voluntario en estos proyectos ha sido una experiencia increíble.'
        },
        {
          foto: 'https://randomuser.me/api/portraits/women/44.jpg',
          texto: 'Gracias a AfroImpacto, hemos logrado mejorar nuestra calidad de vida.'
        },
        {
          foto: 'https://randomuser.me/api/portraits/men/65.jpg',
          texto: 'La colaboración con AfroImpacto ha sido transformadora para nuestra organización.'
        },
        {
          foto: 'https://randomuser.me/api/portraits/women/55.jpg',
          texto: 'Los talleres han sido muy útiles para mi desarrollo personal y profesional.'
        },
        {
          foto: 'https://randomuser.me/api/portraits/men/12.jpg',
          texto: 'Recomiendo AfroImpacto a todos los que quieran hacer una diferencia.'
        },
        {
          foto: 'https://randomuser.me/api/portraits/women/21.jpg',
          texto: 'Mi familia y yo estamos muy agradecidos por el apoyo recibido.'
        },
      ]
    }
  },
  computed: {
    groupedTestimonios() {
      const groups = []
      for (let i = 0; i < this.testimonios.length; i += 3) {
        groups.push(this.testimonios.slice(i, i + 3))
      }
      return groups
    }
  }
}
</script>
<style>
.titulo {
  background:white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
