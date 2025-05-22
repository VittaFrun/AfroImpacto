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
        <v-col cols="auto" class="logo-d d-flex align-center">
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
    <v-dialog
      v-model="showModal"
      max-width="520"
      persistent
      transition="dialog-bottom-transition"
      content-class="custom-auth-dialog"
    >
      <div class="auth-modal-close-outer">
        <v-btn icon @click="showModal = false" class="auth-modal-close-btn" elevation="2">
          <v-icon size="32">mdi-close</v-icon>
        </v-btn>
      </div>
      <v-card class="auth-modal-card pa-0">
        <div class="auth-modal-title text-center font-weight-bold">
          Afro Impacto
        </div>
        <div class="auth-modal-tabs-wrap">
          <v-tabs
            v-model="tab"
            background-color="transparent"
            grow
            class="auth-modal-tabs"
            align-tabs="center"
            slider-color="#18b97e"
            slider-size="3"
            @update:model-value="resetForm"
          >
            <v-tab value="register" class="font-weight-medium auth-modal-tab">Regístrate</v-tab>
            <v-tab value="login" class="font-weight-medium auth-modal-tab">Iniciar sesión</v-tab>
          </v-tabs>
        </div>
        <v-divider></v-divider>
        <v-window v-model="tab" class="pa-7 pt-5" :touch="false" transition="fade-transition">
          <!-- LOGIN -->
          <v-window-item value="login">
            <div>
              <v-btn block class="mb-3 social-btn" elevation="0">
                <v-icon left color="#ea4335">mdi-google</v-icon>
                Continuar con Google
              </v-btn>
              <v-btn block class="mb-5 social-btn" elevation="0">
                <v-icon left color="#4267B2">mdi-facebook</v-icon>
                Continuar con Facebook
              </v-btn>
              <div class="d-flex align-center mb-4">
                <v-divider class="flex-grow-1"></v-divider>
                <span class="mx-3 text-grey">or</span>
                <v-divider class="flex-grow-1"></v-divider>
              </div>
              <v-form ref="loginForm">
                <v-text-field
                  v-model="loginUser"
                  label="Usuario o email"
                  prepend-inner-icon="mdi-account"
                  dense
                  class="mb-4 modern-field"
                  hide-details
                  variant="outlined"
                />
                <v-text-field
                  v-model="loginPassword"
                  label="Contraseña"
                  type="password"
                  prepend-inner-icon="mdi-lock"
                  dense
                  class="mb-2 modern-field"
                  hide-details
                  variant="outlined"
                />
                <div class="text-center mb-4">
                  <a href="#" class="auth-link">¿Olvidaste tu contraseña?</a>
                </div>
                <v-btn block color="#18b97e" class="font-weight-bold text-white mb-2 main-btn" large>
                  Iniciar sesión
                </v-btn>
              </v-form>
              <div class="auth-footer-links text-center mt-5">
                <a href="#" class="auth-link">Soporte</a> — 
                <a href="#" class="auth-link">Términos de Uso</a> — 
                <a href="#" class="auth-link">Política de Privacidad</a>
              </div>
            </div>
          </v-window-item>
          <!-- REGISTER -->
          <v-window-item value="register">
            <div>
              <v-btn block class="mb-3 social-btn" elevation="0">
                <v-icon left color="#ea4335">mdi-google</v-icon>
                Continuar con Google
              </v-btn>
              <v-btn block class="mb-5 social-btn" elevation="0">
                <v-icon left color="#4267B2">mdi-facebook</v-icon>
                Continuar con Facebook
              </v-btn>
              <div class="d-flex align-center mb-4">
                <v-divider class="flex-grow-1"></v-divider>
                <span class="mx-3 text-grey">or</span>
                <v-divider class="flex-grow-1"></v-divider>
              </div>
              <v-form ref="registerForm">
                <v-text-field
                  v-model="registerUser"
                  label="Usuario"
                  prepend-inner-icon="mdi-account"
                  dense
                  class="mb-4 modern-field"
                  hide-details
                  variant="outlined"
                />
                <v-text-field
                  v-model="registerEmail"
                  label="Correo"
                  prepend-inner-icon="mdi-email"
                  dense
                  class="mb-4 modern-field"
                  hide-details
                  variant="outlined"
                />
                <v-text-field
                  v-model="registerPassword"
                  label="Contraseña"
                  type="password"
                  prepend-inner-icon="mdi-lock"
                  dense
                  class="mb-2 modern-field"
                  hide-details
                  variant="outlined"
                />
                <!-- Selección de rol horizontal -->
                <div class="mb-4">
                  <v-radio-group
                    v-model="registerRole"
                    row
                    :mandatory="true"
                    class="role-radio-group"
                  >
                    <v-radio
                      :value="'voluntariado'"
                      class="role-radio"
                      hide-details
                    >
                      <template #label>
                        <span class="role-label">
                          <v-icon left size="22" color="#18b97e">mdi-account-heart</v-icon>
                          Voluntariado
                        </span>
                      </template>
                    </v-radio>
                    <v-radio
                      :value="'organizacion'"
                      class="role-radio"
                      hide-details
                    >
                      <template #label>
                        <span class="role-label">
                          <v-icon left size="22" color="#3f51b5">mdi-domain</v-icon>
                          Organización
                        </span>
                      </template>
                    </v-radio>
                  </v-radio-group>
                  <div v-if="registerRoleError" class="role-error text-center mt-1">
                    Selecciona un rol para continuar
                  </div>
                </div>
                <div class="text-center mb-4">
                  <input type="checkbox" id="terms" v-model="acceptedTerms" style="margin-right:7px;"/>
                  <label for="terms" class="auth-terms-label">
                    Acepto los <a href="#" class="auth-link">Términos y Condiciones</a>
                  </label>
                </div>
                <v-btn
                  block
                  color="#18b97e"
                  class="font-weight-bold text-white mb-2 main-btn"
                  large
                  :disabled="!acceptedTerms || !registerRole"
                  @click="validateRegister"
                >
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
      // Login
      loginUser: "",
      loginPassword: "",
      // Register
      registerUser: "",
      registerEmail: "",
      registerPassword: "",
      registerRole: "",
      registerRoleError: false,
      acceptedTerms: false,
      menuItems: [
        { text: 'Proyectos', href: '#' },
        { text: 'Perfiles', href: '#' },
        { text: 'Nosotros', href: '#' }
      ]
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 20;
    },
    openModal(type) {
      this.tab = type;
      this.showModal = true;
      this.resetForm();
    },
    resetForm() {
      this.loginUser = "";
      this.loginPassword = "";
      this.registerUser = "";
      this.registerEmail = "";
      this.registerPassword = "";
      this.registerRole = "";
      this.registerRoleError = false;
      this.acceptedTerms = false;
      if (this.$refs.loginForm) this.$refs.loginForm.resetValidation();
      if (this.$refs.registerForm) this.$refs.registerForm.resetValidation();
    },
    validateRegister() {
      if (!this.registerRole) {
        this.registerRoleError = true;
        return;
      }
      this.registerRoleError = false;
      // Aquí va la lógica real de registro
    }
  }
}
</script>

<style scoped>
.custom-auth-dialog {
  align-items: flex-start !important;
  justify-content: center !important;
  padding-top: 60px !important;
  background: rgba(24, 185, 126, 0.06) !important;
}
.auth-modal-card {
  background: #fff !important;
  border-radius: 10px !important;
  width: 520px !important;
  height: 780px !important;
  min-width: 520px !important;
  max-width: 520px !important;
  min-height: 780px !important;
  max-height: 780px !important;
  box-shadow: 0 16px 48px 0 rgba(31,38,135,0.13) !important;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  animation: modalFadeIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  padding-left: 36px !important;
  padding-right: 36px !important;
}
@media (max-width: 600px) {
  .auth-modal-card {
    width: 98vw !important;
    min-width: 98vw !important;
    max-width: 98vw !important;
    height: 98vh !important;
    min-height: 98vh !important;
    max-height: 98vh !important;
    padding-left: 6vw !important;
    padding-right: 6vw !important;
  }
}
@keyframes modalFadeIn {
  0% { opacity: 0; transform: translateY(30px) scale(0.97);}
  100% { opacity: 1; transform: translateY(0) scale(1);}
}
.auth-modal-title {
  font-size: 2.2rem;
  color: #18b97e;
  letter-spacing: 1px;
  margin-top: 36px;
  margin-bottom: 0;
}
.auth-modal-close-outer {
  position: absolute;
  right: calc(50% - 325px);
  z-index: 10;
}
.auth-modal-close-btn {
  background: #fff !important;
  color: #18b97e !important;
  border-radius: 50% !important;
  box-shadow: 0 2px 12px #18b97e30 !important;
  transition: background 0.2s, color 0.2s;
}
.auth-modal-close-btn:hover {
  background: #18b97e !important;
  color: #fff !important;
}
.auth-modal-tabs-wrap {
  padding-top: 16px;
  padding-bottom: 0;
}
.auth-modal-tabs {
  background: transparent !important;
  min-height: 0 !important;
}
.auth-modal-tab {
  font-size: 1.22rem !important;
  letter-spacing: 0.5px;
  color: #7a7a7a !important;
  font-weight: 700 !important;
  text-transform: none !important;
  min-width: 50%;
}
.v-tab--selected.auth-modal-tab {
  color: #18b97e !important;
  border-bottom: 3px solid #18b97e !important;
  background: transparent !important;
}
.social-btn {
  border-radius: 32px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  font-size: 1.13rem !important;
  border: 1.5px solid #e0e0e0 !important;
  color: #222 !important;
  background: #fff !important;
  box-shadow: none !important;
  transition: box-shadow 0.18s, background 0.18s, color 0.18s;
}
.social-btn:hover {
  box-shadow: 0 2px 12px #18b97e20 !important;
  background: #f7f7f7 !important;
}
.main-btn {
  border-radius: 22px !important;
  font-size: 1.18rem !important;
  box-shadow: 0 4px 16px #18b97e40 !important;
  text-transform: none !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
}
.role-radio-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 16px;
  margin-top: 10px;
}
.role-radio {
  margin: 0 20px !important;
}
.role-label {
  display: flex;
  align-items: center;
  font-size: 1.11rem;
  font-weight: 600;
  color: #333;
  gap: 6px;
}
.v-selection-control__input input[type="radio"] {
  accent-color: #18b97e;
}
.v-radio .v-icon {
  margin-right: 8px;
}
.role-error {
  color: #e53935;
  font-size: 1.01rem;
  font-weight: 500;
}
.password-strength-bar {
  transition: all 0.3s cubic-bezier(.4,2,.6,1);
  background: linear-gradient(90deg, #e53935 0%, #fb8c00 50%, #43a047 100%) !important;
}
.modern-field .v-input__control {
  background: #f6f8fa !important;
  border-radius: 14px !important;
  border: 1.5px solid #e0e0e0 !important;
  transition: border-color 0.2s;
}
.modern-field input {
  font-size: 1.09rem !important;
  color: #222 !important;
}
.modern-field .v-input__control:focus-within {
  border-color: #18b97e !important;
}
.auth-link {
  color: #18b97e !important;
  font-weight: 500 !important;
  text-transform: none !important;
  text-decoration: underline !important;
  cursor: pointer;
}
.auth-terms-label {
  color: #7a7a7a !important;
  font-size: 1.05rem !important;
  font-weight: 500;
}
.auth-footer-links {
  margin-top: 16px;
  font-size: 0.99rem;
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