# 🎨 AfroImpacto - Modern UI Components

## Descripción General

Este documento describe los componentes de UI modernos creados para AfroImpacto, diseñados para proporcionar una experiencia de usuario consistente y atractiva en toda la aplicación.

## 🚀 Componentes Disponibles

### 1. ModernButton

Un botón moderno con animaciones suaves y efectos hover.

#### Props
- `color`: Color del botón (primary, success, warning, error, info)
- `variant`: Variante del botón (flat, outlined, text, tonal)
- `size`: Tamaño del botón (small, default, large)
- `disabled`: Estado deshabilitado
- `loading`: Estado de carga
- `text`: Texto del botón
- `prependIcon`: Icono antes del texto
- `appendIcon`: Icono después del texto
- `rounded`: Bordes redondeados (default: true)
- `elevation`: Sombra elevada (default: true)
- `hover`: Efectos hover (default: true)

#### Ejemplo de Uso
```vue
<template>
  <ModernButton
    color="primary"
    size="large"
    prepend-icon="mdi-plus"
    @click="handleClick"
  >
    Agregar Elemento
  </ModernButton>
</template>
```

### 2. ModernCard

Una tarjeta moderna con múltiples variantes y efectos visuales.

#### Props
- `title`: Título de la tarjeta
- `subtitle`: Subtítulo de la tarjeta
- `icon`: Icono del header
- `iconColor`: Color del icono
- `iconTextColor`: Color del texto del icono
- `iconSize`: Tamaño del avatar del icono
- `iconTextSize`: Tamaño del icono dentro del avatar
- `elevation`: Elevación de la tarjeta
- `hover`: Efectos hover
- `loading`: Estado de carga
- `error`: Mensaje de error
- `variant`: Variante de la tarjeta (default, outlined, filled, tonal, gradient)
- `rounded`: Bordes redondeados (default: true)
- `gradient`: Aplicar gradiente de fondo
- `gradientDirection`: Dirección del gradiente

#### Slots
- `default`: Contenido principal
- `content`: Contenido específico
- `headerActions`: Acciones en el header
- `actions`: Acciones en el footer

#### Ejemplo de Uso
```vue
<template>
  <ModernCard
    title="Estadísticas"
    subtitle="Resumen del mes"
    icon="mdi-chart-line"
    icon-color="primary"
    variant="filled"
  >
    <template #content>
      <div class="text-center py-4">
        <div class="text-h3 font-weight-bold text-primary">150</div>
        <div class="text-caption text-grey">Total elementos</div>
      </div>
    </template>
    
    <template #actions>
      <ModernButton color="primary" @click="viewDetails">
        Ver Detalles
      </ModernButton>
    </template>
  </ModernCard>
</template>
```

### 3. ModernDialog

Un modal moderno con animaciones y múltiples opciones de configuración.

#### Props
- `modelValue`: Estado de apertura/cierre
- `title`: Título del modal
- `subtitle`: Subtítulo del modal
- `icon`: Icono del header
- `iconColor`: Color del icono
- `maxWidth`: Ancho máximo del modal
- `persistent`: Modal persistente (no se cierra al hacer clic fuera)
- `scrollable`: Contenido scrolleable
- `fullscreen`: Modal de pantalla completa
- `showHeader`: Mostrar header (default: true)
- `showCloseButton`: Mostrar botón de cerrar (default: true)
- `showActions`: Mostrar sección de acciones (default: true)
- `showCancelButton`: Mostrar botón cancelar (default: true)
- `showConfirmButton`: Mostrar botón confirmar (default: true)
- `cancelText`: Texto del botón cancelar
- `confirmText`: Texto del botón confirmar
- `confirmColor`: Color del botón confirmar
- `confirmIcon`: Icono del botón confirmar
- `confirmLoading`: Estado de carga del botón confirmar
- `cancelLoading`: Estado de carga del botón cancelar
- `confirmDisabled`: Botón confirmar deshabilitado
- `loading`: Estado de carga del contenido
- `error`: Mensaje de error
- `contentPadding`: Padding del contenido
- `contentBackground`: Fondo del contenido

#### Events
- `update:modelValue`: Actualización del estado
- `confirm`: Confirmación
- `cancel`: Cancelación
- `close`: Cierre del modal

#### Slots
- `default`: Contenido principal
- `content`: Contenido específico
- `actions`: Acciones personalizadas

#### Ejemplo de Uso
```vue
<template>
  <ModernDialog
    v-model="dialog"
    title="Confirmar Acción"
    subtitle="Esta acción no se puede deshacer"
    icon="mdi-alert"
    icon-color="warning"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #content>
      <p>¿Estás seguro de que deseas continuar?</p>
    </template>
  </ModernDialog>
</template>
```

## 🎨 Estilos Globales

### Variables CSS Disponibles

```css
:root {
  /* Colores Primarios */
  --afro-primary: #1976d2;
  --afro-primary-light: #42a5f5;
  --afro-primary-dark: #1565c0;
  
  /* Colores Secundarios */
  --afro-secondary: #388e3c;
  --afro-secondary-light: #66bb6a;
  --afro-secondary-dark: #2e7d32;
  
  /* Colores de Estado */
  --afro-success: #4caf50;
  --afro-warning: #ff9800;
  --afro-error: #f44336;
  --afro-info: #2196f3;
  
  /* Sombras */
  --afro-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --afro-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --afro-shadow-lg: 0 8px 25px rgba(0, 0, 0, 0.15);
  --afro-shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.2);
  
  /* Border Radius */
  --afro-radius-sm: 8px;
  --afro-radius-md: 12px;
  --afro-radius-lg: 16px;
  --afro-radius-xl: 20px;
  
  /* Transiciones */
  --afro-transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --afro-transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --afro-transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Clases de Utilidad

#### Animaciones
- `.animate-slide-in-up`: Desliza hacia arriba
- `.animate-fade-in-up`: Aparece desde abajo
- `.animate-slide-in-left`: Desliza desde la izquierda
- `.animate-slide-in-right`: Desliza desde la derecha
- `.animate-pulse`: Efecto de pulso
- `.animate-bounce`: Efecto de rebote

#### Efectos Hover
- `.hover-lift`: Eleva el elemento al hacer hover
- `.hover-scale`: Escala el elemento al hacer hover
- `.hover-glow`: Efecto de brillo al hacer hover

#### Estados de Focus
- `.focus-ring`: Anillo de enfoque accesible

#### Estados de Carga
- `.loading-skeleton`: Efecto de esqueleto de carga

## 📱 Responsive Design

Todos los componentes están optimizados para dispositivos móviles:

- **Desktop (>768px)**: Experiencia completa con todos los efectos
- **Tablet (768px)**: Adaptación de espaciados y tamaños
- **Mobile (<480px)**: Optimización para pantallas pequeñas

## ♿ Accesibilidad

Los componentes incluyen:

- **Navegación por teclado**: Soporte completo para navegación con Tab
- **Screen readers**: Etiquetas ARIA apropiadas
- **Alto contraste**: Soporte para modo de alto contraste
- **Movimiento reducido**: Respeta las preferencias de movimiento reducido
- **Focus visible**: Indicadores de enfoque claros

## 🌙 Modo Oscuro

Soporte automático para modo oscuro usando `prefers-color-scheme: dark`:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --afro-grey-50: #1a1a1a;
    --afro-grey-100: #2d2d2d;
    /* ... más variables para modo oscuro */
  }
}
```

## 🎯 Mejores Prácticas

### 1. Consistencia Visual
- Usa siempre los componentes modernos para mantener consistencia
- Aplica la paleta de colores definida
- Mantén espaciados consistentes

### 2. Performance
- Los componentes están optimizados para rendimiento
- Usa `v-memo` para listas grandes
- Implementa lazy loading cuando sea necesario

### 3. UX/UI
- Proporciona feedback visual inmediato
- Usa estados de carga apropiados
- Implementa confirmaciones para acciones destructivas

### 4. Accesibilidad
- Siempre incluye texto alternativo para iconos
- Usa colores con suficiente contraste
- Proporciona navegación por teclado

## 🔧 Personalización

### Extender Componentes
```vue
<template>
  <ModernButton
    class="custom-button"
    color="primary"
    @click="handleClick"
  >
    Botón Personalizado
  </ModernButton>
</template>

<style scoped>
.custom-button {
  /* Estilos personalizados */
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4) !important;
}
</style>
```

### Crear Variantes
```vue
<template>
  <ModernCard
    :class="['special-card', variant]"
    title="Tarjeta Especial"
  >
    <!-- Contenido -->
  </ModernCard>
</template>

<style scoped>
.special-card.variant-premium {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  color: white !important;
}
</style>
```

## 📚 Ejemplos Completos

### Dashboard con Estadísticas
```vue
<template>
  <v-container fluid class="pa-8">
    <v-row>
      <v-col cols="12" md="3" v-for="stat in stats" :key="stat.id">
        <ModernCard
          :title="stat.title"
          :subtitle="stat.subtitle"
          :icon="stat.icon"
          :icon-color="stat.color"
          variant="filled"
          class="animate-fade-in-up"
        >
          <template #content>
            <div class="text-center py-4">
              <div class="text-h3 font-weight-bold" :class="`text-${stat.color}`">
                {{ stat.value }}
              </div>
              <div class="text-caption text-grey">{{ stat.description }}</div>
            </div>
          </template>
        </ModernCard>
      </v-col>
    </v-row>
  </v-container>
</template>
```

### Formulario con Validación
```vue
<template>
  <ModernDialog
    v-model="dialog"
    title="Crear Usuario"
    subtitle="Completa la información del nuevo usuario"
    icon="mdi-account-plus"
    icon-color="primary"
    @confirm="saveUser"
    @cancel="closeDialog"
  >
    <template #content>
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="userForm.name"
              label="Nombre"
              variant="outlined"
              :rules="[v => !!v || 'El nombre es requerido']"
              required
              class="modern-input"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="userForm.email"
              label="Email"
              type="email"
              variant="outlined"
              :rules="[v => !!v || 'El email es requerido', v => /.+@.+\..+/.test(v) || 'Email inválido']"
              required
              class="modern-input"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </ModernDialog>
</template>
```

## 🚀 Próximos Pasos

1. **Implementar más componentes**: Tooltip, Snackbar, Progress, etc.
2. **Añadir temas personalizados**: Crear temas específicos para diferentes secciones
3. **Optimizar para PWA**: Mejorar la experiencia en dispositivos móviles
4. **Añadir más animaciones**: Implementar micro-interacciones
5. **Crear storybook**: Documentación interactiva de componentes

---

**Nota**: Estos componentes están diseñados específicamente para AfroImpacto y siguen las mejores prácticas de Vue 3, Vuetify 3 y accesibilidad web.
