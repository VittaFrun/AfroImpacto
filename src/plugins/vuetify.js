// src/plugins/vuetify.js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'


export default createVuetify({
theme: {
    defaultTheme: 'light',
  },
  defaults: {
    global: {
      style: {
        fontFamily: 'Open Sans, sans-serif',
      },
    },
    VCard: {
      variant: 'flat',
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
    mdi,
    },
},
theme: {
    defaultTheme: 'afroImpactoTheme',
    themes: {
      afroImpactoTheme: {
        colors: {
          primary: '#4ec7a5',
          secondary: '#18b97e',
          accent: '#3f51b5',
          background: '#e9eef2',
          surface: '#ffffff',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        },
      },
    },
},
})