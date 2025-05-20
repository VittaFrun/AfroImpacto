<template>
  <v-app-bar
    fixed
    flat
    :color="scrolled ? '#4ec7a5' : 'transparent'"
    height="72"
    class="header-blur"
    :elevation="scrolled ? 2 : 0"
    style="transition: background 0.3s;"
  >
    <v-container fluid>
      <v-row align="center" justify="space-between" no-gutters>
        <!-- Logo y título -->
        <v-col cols="auto" class="d-flex align-center" style="padding-left: 16px;">
          <v-img
            src="/src/components/icons/logo_afroimpacto.png"
            alt="Logo"
            width="200"
            height="200"
            style="object-fit: contain;"
          />
        </v-col>

        <!-- Menú Desktop alineado a la derecha -->
        <v-col cols="auto" class="d-none d-md-flex align-center justify-end">
          <div class="d-flex align-center">
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
              class="ml-2 registrar-btn"
              depressed
              @click="openModal('register')"
            >
              Registrarse
            </v-btn>
            <v-btn
              class="ml-2 ingresar-btn"
              depressed
              @click="openModal('login')"
            >
              Ingresar
            </v-btn>
          </div>
        </v-col>

        <!-- Menú móvil -->
        <v-col cols="auto" class="d-flex d-md-none" style="margin-left: auto;">
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
            class="registrar-btn mb-2"
            depressed
            @click="drawer = false; openModal('register')"
          >
            Registrarse
          </v-btn>
          <v-btn
            block
            class="ingresar-btn"
            depressed
            @click="drawer = false; openModal('login')"
          >
            Ingresar
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- MODAL LOGIN/REGISTER -->
    <v-dialog v-model="showModal" max-width="430" transition="dialog-bottom-transition" persistent>
      <v-card class="glass-modal pa-0">
        <v-btn icon @click="showModal = false" class="close-btn" elevation="0">
          <v-icon size="28">mdi-close</v-icon>
        </v-btn>
        <div class="modal-header">
          <v-tabs
            v-model="tab"
            background-color="transparent"
            grow
            class="modal-tabs"
            slider-color="gradient"
            align-tabs="center"
          >
            <v-tab value="register" class="font-weight-medium tab-gradient">Regístrate</v-tab>
            <v-tab value="login" class="font-weight-medium tab-gradient">Iniciar sesión</v-tab>
          </v-tabs>
        </div>
        <v-divider></v-divider>
        <v-window v-model="tab" class="pa-4">
          <!-- LOGIN -->
          <v-window-item value="login">
            <div>
              <v-btn block class="mb-3 social-btn google-btn" elevation="0">
                <v-icon left color="#ea4335">mdi-google</v-icon>
                Google
              </v-btn>
              <v-btn block class="mb-5 social-btn facebook-btn" elevation="0">
                <v-icon left color="#4267B2">mdi-facebook</v-icon>
                Facebook
              </v-btn>
              <div class="d-flex align-center mb-4">
                <v-divider class="flex-grow-1"></v-divider>
                <span class="mx-3 text-grey">o</span>
                <v-divider class="flex-grow-1"></v-divider>
              </div>
              <v-form>
                <v-text-field
                  label="Usuario o email"
                  placeholder="example@gmail.com"
                  prepend-inner-icon="mdi-email"
                  dense
                  class="mb-3"
                  hide-details
                  variant="solo"
                />
                <v-text-field
                  label="Contraseña"
                  type="password"
                  prepend-inner-icon="mdi-lock"
                  dense
                  class="mb-5"
                  hide-details
                  variant="solo"
                />
                <v-btn block color="#4ec7a5" class="font-weight-bold text-white mb-2 login-btn" large>
                  Iniciar sesión
                </v-btn>
              </v-form>
            </div>
          </v-window-item>
          <!-- REGISTER -->
          <v-window-item value="register">
            <div>
              <v-btn block class="mb-3 social-btn google-btn" elevation="0">
                <v-icon left color="#ea4335">mdi-google</v-icon>
                Google
              </v-btn>
              <v-btn block class="mb-5 social-btn facebook-btn" elevation="0">
                <v-icon left color="#4267B2">mdi-facebook</v-icon>
                Facebook
              </v-btn>
              <div class="d-flex align-center mb-4">
                <v-divider class="flex-grow-1"></v-divider>
                <span class="mx-3 text-grey">o</span>
                <v-divider class="flex-grow-1"></v-divider>
              </div>
              <v-form>
                <v-text-field
                  label="Usuario o email"
                  placeholder="example@gmail.com"
                  prepend-inner-icon="mdi-email"
                  dense
                  class="mb-3"
                  hide-details
                  variant="solo"
                />
                <v-text-field
                  label="Contraseña"
                  type="password"
                  prepend-inner-icon="mdi-lock"
                  dense
                  class="mb-1"
                  hide-details
                  variant="solo"
                  v-model="registerPassword"
                  @input="checkPasswordStrength"
                />
                <!-- Barra de intensidad -->
                <v-progress-linear
                  :color="passwordStrengthColor"
                  :value="passwordStrengthValue"
                  height="7"
                  class="mb-1 password-strength-bar"
                  rounded
                />
                <div class="mb-2" :style="{ color: passwordStrengthColor, fontWeight: 'bold', fontSize: '0.97rem' }">
                  Intensidad {{ passwordStrengthText }}
                </div>
                <div class="mb-3 text-grey-darken-1" style="font-size: 0.98rem;">
                  * al menos 8 caracteres, incluido un número
                </div>
                <v-btn block color="#4ec7a5" class="font-weight-bold text-white mb-2 login-btn" large>
                  Registrarse
                </v-btn>
              </v-form>
            </div>
          </v-window-item>
        </v-window>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      drawer: false,
      scrolled: false,
      showModal: false,
      tab: "login",
      registerPassword: "",
      passwordStrengthValue: 0,
      passwordStrengthText: 'muy fácil',
      passwordStrengthColor: '#e53935',
      menuItems: [
        { text: 'Proyectos', href: '#' },
        { text: 'Perfiles', href: '#' },
        { text: 'Nosotros', href: '#' }
      ]
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 20
    },
    openModal(type) {
      this.tab = type
      this.showModal = true
    },
    checkPasswordStrength() {
      const pwd = this.registerPassword
      let score = 0
      if (pwd.length >= 8) score += 1
      if (/\d/.test(pwd)) score += 1
      if (/[A-Z]/.test(pwd)) score += 1
      if (/[a-z]/.test(pwd)) score += 1
      if (/[^A-Za-z0-9]/.test(pwd)) score += 1

      if (score <= 1) {
        this.passwordStrengthValue = 20
        this.passwordStrengthText = 'muy fácil'
        this.passwordStrengthColor = '#e53935'
      } else if (score === 2) {
        this.passwordStrengthValue = 40
        this.passwordStrengthText = 'fácil'
        this.passwordStrengthColor = '#fb8c00'
      } else if (score === 3) {
        this.passwordStrengthValue = 60
        this.passwordStrengthText = 'media'
        this.passwordStrengthColor = '#fdd835'
      } else if (score === 4) {
        this.passwordStrengthValue = 80
        this.passwordStrengthText = 'fuerte'
        this.passwordStrengthColor = '#43a047'
      } else if (score === 5) {
        this.passwordStrengthValue = 100
        this.passwordStrengthText = 'muy fuerte'
        this.passwordStrengthColor = '#1e88e5'
      }
    }
  }
}
</script>

<style scoped>
/* Glassmorphism modal */
.glass-modal {
  background: rgba(255,255,255,0.18) !important;
  backdrop-filter: blur(16px);
  border-radius: 26px !important;
  box-shadow: 0 12px 48px 0 rgba(31,38,135,0.15);
  position: relative;
  overflow: visible;
  animation: modalFadeIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
@keyframes modalFadeIn {
  0% { opacity: 0; transform: translateY(30px) scale(0.97);}
  100% { opacity: 1; transform: translateY(0) scale(1);}
}
.close-btn {
  background: rgba(255,255,255,0.7) !important;
  color: #4ec7a5 !important;
  border-radius: 50% !important;
  box-shadow: 0 2px 8px #4ec7a5 !important;
  position: absolute !important;
  top: 14px;
  right: 14px;
  z-index: 2;
  transition: background 0.2s, color 0.2s;
}
.close-btn:hover {
  background: #4ec7a5 !important;
  color: #fff !important;
}
.modal-header {
  padding-top: 36px;
  padding-bottom: 0;
}
.modal-tabs {
  background: transparent !important;
}
.tab-gradient {
  background: linear-gradient(90deg, #4ec7a5, #3f51b5 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.13rem !important;
  font-weight: bold !important;
  letter-spacing: 0.4px;
}
.v-tab--selected.tab-gradient {
  border-bottom: 3px solid #4ec7a5 !important;
  -webkit-text-fill-color: #4ec7a5;
  color: #4ec7a5 !important;
}
.social-btn {
  border-radius: 28px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  font-size: 1.07rem !important;
  box-shadow: none !important;
  background: rgba(255,255,255,0.66);
  transition: box-shadow 0.18s, background 0.18s;
}
.google-btn:hover {
  background: #ea4335 !important;
  color: #fff !important;
}
.facebook-btn:hover {
  background: #4267B2 !important;
  color: #fff !important;
}
.login-btn {
  border-radius: 22px !important;
  font-size: 1.11rem !important;
  box-shadow: 0 4px 12px #4ec7a5a0 !important;
  letter-spacing: 0.5px;
  text-transform: none;
}
.password-strength-bar {
  transition: all 0.3s cubic-bezier(.4,2,.6,1);
}
.header-blur {
  box-shadow:#4ec7a5 0px 0px 20px rgba(95, 179, 125, 0.12);
  border-bottom: 1px solid rgba(200, 255, 220, 0.12);
  z-index: 100;
}
.menu-btn {
  color: #fff !important;
  border-radius: 12px;
  font-weight: 500;
  text-transform: none;
  transition: background 0.2s, color 0.2s;
  background: transparent !important;
  margin-right: 8px;
}
.menu-btn:hover {
  background: #4ec7a5 !important;
  color: #fff !important;
  box-shadow: 0 4px 10px #4ec7a5 !important;
}
.ingresar-btn,
.registrar-btn {
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
.ingresar-btn:hover,
.registrar-btn:hover {
  background: #fff !important;
  color: #4ec7a5 !important;
  box-shadow: 0 4px 10px #4ec7a5 !important;
}
</style>
