<template>
  <v-app-bar
    flat
    color="#c6f1df"
    height="72"
    class="elevation-2"
    style="backdrop-filter: blur(6px);"
  >
    <v-container fluid>
      <v-row align="center" justify="space-between" no-gutters>
        <!-- Logo y título -->
        <v-col cols="auto" class="d-flex align-center">
          <v-img
            src="\src\components\icons\logo_afroimpacto.png"
            alt="Logo"
            width="250"
            height="190"
            class="mr-2"
          />
        </v-col>

        <!-- Menú Desktop -->
        <v-col cols="auto" class="d-none d-md-flex align-center">
          <v-btn
            v-for="item in menuItems"
            :key="item.text"
            text
            class="mx-2 text-body-1 font-weight-medium menu-btn"
            :to="item.href"
          >
            {{ item.text }}
          </v-btn>
          <v-btn
          class="ml-4 ingresar-btn"
          depressed
          to="/login"
          router
        >
          Ingresar
        </v-btn>
        
        </v-col>

        <!-- Menú móvil -->
        <v-col cols="auto" class="d-flex d-md-none">
          <v-btn icon @click="drawer = true">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Drawer para móvil -->
    <v-navigation-drawer v-model="drawer" temporary right>
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.text"
          :to="item.href"
          @click="drawer = false"
        >
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
        <v-divider class="my-2"></v-divider>
        <v-list-item>
          <v-btn
            block
            class="ingresar-btn"
            depressed
            @click="drawer = false"
          >
            Ingresar
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      drawer: false,
      menuItems: [
        { text: 'Proyectos', href: '#' },
        { text: 'Perfiles', href: '#' },
        { text: 'Nosotros', href: '#' }
      ]
    }
  }
}
</script>

<style scoped>
.menu-btn {
  color: #4ec7a5 !important;
  border-radius: 12px;
  font-weight: 500;
  text-transform: none;
  transition: background 0.2s, color 0.2s;
}
.menu-btn:hover {
  color: #4ec7a5 !important;
  box-shadow: 0 4px 10px #4ec7a5 !important;
}

.ingresar-btn {
  background-color: #4ec7a5 !important;
  color: #fff !important;
  border-radius: 12px !important;
  min-width: 140px;
  min-height: 48px;
  font-size: 1.15rem;
  font-weight: bold;
  text-transform: none;
  box-shadow: none !important;
  letter-spacing: 0.5px;

}

.ingresar-btn:hover {
  background: #4ec7a5 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 10px #4ec7a5 !important;
}

</style>
