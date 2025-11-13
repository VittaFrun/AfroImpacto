import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // Optimizaciones de build
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // Code splitting manual para optimizar carga
        manualChunks(id) {
          // Vendor chunks - librerías de terceros
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vendor-vue';
            }
            if (id.includes('vuetify')) {
              return 'vendor-vuetify';
            }
            if (id.includes('echarts')) {
              return 'vendor-charts';
            }
            if (id.includes('axios') || id.includes('date-fns')) {
              return 'vendor-utils';
            }
            if (id.includes('vuedraggable')) {
              return 'vendor-drag';
            }
            // Otros node_modules
            return 'vendor-other';
          }
          
          // Feature chunks - código por feature
          if (id.includes('/features/organization/')) {
            return 'feature-organization';
          }
          if (id.includes('/features/volunteer/')) {
            return 'feature-volunteer';
          }
          if (id.includes('/features/auth/')) {
            return 'feature-auth';
          }
        },
        
        // Nombres de archivos optimizados
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    
    // Optimizaciones adicionales
    cssCodeSplit: true,
    reportCompressedSize: false, // Mejora velocidad de build
  },
  
  // Optimizaciones de dependencias
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'vuetify',
      'axios',
      'date-fns',
    ],
    exclude: ['vue-demi'],
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 5173,
    open: false,
    cors: true,
  },
  
  // Configuración de preview
  preview: {
    port: 4173,
    open: false,
  },
})
