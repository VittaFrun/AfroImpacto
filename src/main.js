import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { useAuthStore } from './features/auth/stores/authStore'

import './assets/styles/base.css'
import './assets/styles/design-system.css'
import './assets/styles/professional-buttons.css'

const app = createApp(App)

app.use(createPinia())

// Initialize auth store and check for existing session
const authStore = useAuthStore()
try {
  authStore.checkAuth()
} catch (e) {
    // This can happen if pinia is not initialized yet, which is fine
    // The router guard will handle redirection anyway.
}

app.use(router)
app.use(vuetify)

app.mount('#app')