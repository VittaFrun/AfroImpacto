<template>
  <div style="background-color: #e6faf2;">
    <v-container fluid class="py-12">
      <h3 class="text-center font-weight-bold mb-8" style="font-size:1.5rem;">Noticias y Actualizaciones</h3>
      <v-carousel
        cycle
        :interval="5000"
        show-arrows
        hide-delimiters
        height="420"
      >
        <v-carousel-item
          v-for="(group, index) in groupedNoticias"
          :key="index"
        >
          <v-row class="fill-height" align="stretch" justify="center">
            <v-col
              v-for="(noticia, i) in group"
              :key="i"
              cols="12"
              sm="4"
              class="d-flex"
            >
              <v-card
                elevation="1"
                class="mx-auto w-100 d-flex flex-column"
                style="border-radius: 8px; background: #fff; box-shadow: 2 4px 10px rgba(60,60,60,0.06); padding-top: 10px; padding-left: 10px; padding-right: 10px;"
              >
                <v-img
                  :src="noticia.img"
                  height="210"
                  class="rounded-t-lg"
                  cover
                  style="border-radius: 8px;"

                  
                />
                <div class="pa-5 pb-4">
                  <div class="font-weight-bold mb-1" style="font-size: 1.15rem; text-align: left;">
                    {{ noticia.titulo }}
                  </div>
                  <div style="color: #8a8a8a; font-size: 1rem; text-align: left; margin-bottom: 20px;">
                    {{ noticia.descripcion }}
                  </div>
                  <v-btn
                    color="#4ec7a5"
                    class="info-btn text-white font-weight-bold px-6"
                    style="border-radius: 8px; text-transform: none; font-size: 1rem;"
                    depressed
                  >
                    Leer más
                  </v-btn>
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
  name: 'NewsUpdates',
  data() {
    return {
      noticias: [
        {
          img: 'https://storage.googleapis.com/a1aa/image/310e377e-c401-4910-cc1b-6dba154b375e.jpg',
          titulo: 'Evento de Inclusión',
          descripcion: 'Únete a nuestro próximo evento para celebrar la diversidad.'
        },
        {
          img: 'https://storage.googleapis.com/a1aa/image/2c8e32d5-64cd-477a-ba07-6854233e0871.jpg',
          titulo: 'Nueva Alianza',
          descripcion: 'Hemos formado una nueva alianza para expandir nuestro impacto.'
        },
        {
          img: 'https://storage.googleapis.com/a1aa/image/062439ab-009b-41db-ab1a-a9ab04918df5.jpg',
          titulo: 'Proyecto Destacado',
          descripcion: 'Descubre cómo este proyecto está cambiando vidas.'
        },
        {
          img: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=400&q=80',
          titulo: 'Talleres Comunitarios',
          descripcion: 'Nueva serie de talleres para el desarrollo de habilidades técnicas'
        },
        {
          img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
          titulo: 'Convenio Educativo',
          descripcion: 'Firmamos convenio con importantes instituciones educativas'
        },
        {
          img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80',
          titulo: 'Voluntariado Internacional',
          descripcion: 'Ampliamos nuestro programa de voluntariado a nuevos países'
        },
        {
          img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80',
          titulo: 'Premio a la Innovación',
          descripcion: 'Recibimos reconocimiento por nuestros proyectos innovadores'
        },
        {
          img: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=400&q=80',
          titulo: 'Expansión Regional',
          descripcion: 'Inauguramos nuevas oficinas en 3 regiones del país'
        },
        {
          img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
          titulo: 'Programa de Becas',
          descripcion: 'Conoce nuestro nuevo programa de becas para jóvenes talentos'
        }
      ]
    }
  },
  computed: {
    groupedNoticias() {
      const groups = []
      for (let i = 0; i < this.noticias.length; i += 3) {
        groups.push(this.noticias.slice(i, i + 3))
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