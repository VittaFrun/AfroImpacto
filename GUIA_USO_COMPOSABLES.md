# 📚 Guía de Uso de Composables y Utilidades

Esta guía explica cómo usar los nuevos composables y utilidades creados para mejorar el código del frontend.

---

## 🎯 Composables

### useApi

Composable para manejar llamadas API de forma reutilizable.

```javascript
import { useApi } from '@/composables/useApi';

// En tu componente
const { loading, error, data, get, post, put, patch, remove } = useApi('/proyecto');

// Usar
const fetchProjects = async () => {
  await get(); // GET /proyecto
  // data.value ahora contiene los proyectos
};

const createProject = async (projectData) => {
  await post('', projectData); // POST /proyecto
};

const updateProject = async (id, projectData) => {
  await patch(`/${id}`, projectData); // PATCH /proyecto/:id
};
```

### useErrorHandler

Composable para manejo centralizado de errores.

```javascript
import { useErrorHandler } from '@/composables/useErrorHandler';

const { handleError, handleValidationError, handleNetworkError, handleAuthError } = useErrorHandler();

// Manejo básico
try {
  await someOperation();
} catch (error) {
  handleError(error, 'Error personalizado');
}

// Manejo de errores de validación
try {
  await submitForm();
} catch (error) {
  const validationErrors = handleValidationError(error);
  // validationErrors contiene los errores por campo
}

// Manejo de errores de red
try {
  await fetchData();
} catch (error) {
  handleNetworkError(error);
}
```

### useLoading

Composable para manejar estados de carga.

```javascript
import { useLoading } from '@/composables/useLoading';

const { loading, startLoading, stopLoading, withLoading } = useLoading();

// Opción 1: Manual
const fetchData = async () => {
  startLoading();
  try {
    await api.get('/data');
  } finally {
    stopLoading();
  }
};

// Opción 2: Automático (recomendado)
const fetchData = async () => {
  await withLoading(async () => {
    await api.get('/data');
  });
};
```

### useProjectDetail

Composable específico para la lógica del detalle de proyecto.

```javascript
import { useProjectDetail } from '@/features/organization/projects/composables/useProjectDetail';

const {
  project,
  projectLoading,
  volunteerHours,
  horasSummary,
  solicitudes,
  loadVolunteerHours,
  verificarHoras,
  updateSolicitudEstado,
} = useProjectDetail();

// El composable carga automáticamente los datos al montar
// Puedes usar los datos directamente en el template
```

---

## 🛠️ Utilidades

### Formatters (`utils/formatters.js`)

Funciones para formatear datos.

```javascript
import { 
  formatDate, 
  formatRelativeDate, 
  formatDateRange,
  formatCurrency,
  formatNumber,
  formatPercentage,
  truncateText,
  capitalize,
  formatFullName,
  formatDuration
} from '@/utils/formatters';

// Fechas
formatDate(new Date(), 'dd/MM/yyyy'); // "25/12/2024"
formatRelativeDate(new Date()); // "hace 2 horas"
formatDateRange(startDate, endDate); // "01/01/2024 - 31/12/2024"

// Moneda y números
formatCurrency(1000000); // "$1.000.000,00"
formatNumber(1234567); // "1.234.567"
formatPercentage(75.5); // "75,5%"

// Texto
truncateText('Texto muy largo...', 20); // "Texto muy largo..."
capitalize('hola mundo'); // "Hola mundo"
formatFullName('Juan', 'Pérez'); // "Juan Pérez"

// Duración
formatDuration(2.5); // "2,5h"
formatDuration(25); // "1d 1h"
```

### Validators (`utils/validators.js`)

Funciones de validación reutilizables.

```javascript
import { 
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isNotEmpty,
  isInRange,
  hasMinLength,
  isValidPassword,
  createValidationRules
} from '@/utils/validators';

// Validaciones individuales
isValidEmail('test@example.com'); // true
isValidPhone('+57 300 123 4567'); // true
isValidPassword('Password123'); // true

// Crear reglas para Vuetify
const emailRules = createValidationRules({
  required: true,
  email: true
});

const passwordRules = createValidationRules({
  required: true,
  password: true,
  minLength: 8
});
```

### API Helpers (`utils/api.js`)

Helpers para llamadas API.

```javascript
import { apiGet, apiPost, apiPatch, apiDelete, API_ENDPOINTS } from '@/utils/api';

// Usar endpoints de constantes
const projects = await apiGet(API_ENDPOINTS.PROJECTS.BASE);
const project = await apiGet(API_ENDPOINTS.PROJECTS.BY_ID(1));

// O usar directamente
const data = await apiGet('/proyecto');
const created = await apiPost('/proyecto', projectData);
const updated = await apiPatch('/proyecto/1', updates);
await apiDelete('/proyecto/1');
```

---

## 📦 Constantes

### Routes (`constants/routes.js`)

```javascript
import { ROUTES } from '@/constants/routes';

// Navegar usando constantes
router.push(ROUTES.ORGANIZATION.PROJECTS);
router.push(ROUTES.ORGANIZATION.PROJECT_DETAIL(projectId));
router.push(ROUTES.VOLUNTEER.PROJECT_WORKSPACE(projectId));
```

### API Endpoints (`constants/api.js`)

```javascript
import { API_ENDPOINTS } from '@/constants/api';

// Usar endpoints
const endpoint = API_ENDPOINTS.PROJECTS.BY_ID(projectId);
const response = await axios.get(endpoint);
```

### Config (`constants/config.js`)

```javascript
import { APP_CONFIG, getConfig } from '@/constants/config';

// Usar configuración
const apiUrl = APP_CONFIG.API_BASE_URL;
const pageSize = APP_CONFIG.DEFAULT_PAGE_SIZE;
const isDev = getConfig().ENABLE_LOGGING;
```

---

## 🎨 Componentes de Feedback

### LoadingState

```vue
<template>
  <LoadingState :loading="loading" message="Cargando proyectos...">
    <ProjectList :projects="projects" />
  </LoadingState>
</template>

<script setup>
import LoadingState from '@/components/feedback/LoadingState.vue';
</script>
```

### ErrorState

```vue
<template>
  <ErrorState
    v-if="error"
    :error="error"
    title="Error al cargar"
    :show-retry="true"
    @retry="fetchData"
  />
</template>

<script setup>
import ErrorState from '@/components/feedback/ErrorState.vue';
</script>
```

---

## 📝 Ejemplo Completo

```vue
<template>
  <div>
    <LoadingState :loading="loading" message="Cargando proyecto...">
      <ErrorState
        v-if="error"
        :error="error"
        :show-retry="true"
        @retry="loadProject"
      />
      
      <div v-else-if="project">
        <h1>{{ project.name }}</h1>
        <p>Fecha: {{ formatDate(project.startDate) }}</p>
        <p>Presupuesto: {{ formatCurrency(project.budget) }}</p>
      </div>
    </LoadingState>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useApi';
import { useErrorHandler } from '@/composables/useErrorHandler';
import { useLoading } from '@/composables/useLoading';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { API_ENDPOINTS } from '@/constants/api';
import LoadingState from '@/components/feedback/LoadingState.vue';
import ErrorState from '@/components/feedback/ErrorState.vue';

const route = useRoute();
const { get } = useApi(API_ENDPOINTS.PROJECTS.BASE);
const { handleError } = useErrorHandler();
const { loading, withLoading } = useLoading();

const project = ref(null);
const error = ref(null);

const loadProject = async () => {
  error.value = null;
  await withLoading(async () => {
    try {
      const projectId = parseInt(route.params.id, 10);
      project.value = await get(`/${projectId}`);
    } catch (err) {
      error.value = err;
      handleError(err);
    }
  });
};

onMounted(() => {
  loadProject();
});
</script>
```

---

## ✅ Beneficios

1. **Código más limpio**: Menos duplicación, más reutilización
2. **Mantenimiento fácil**: Cambios centralizados
3. **Consistencia**: Mismo comportamiento en toda la app
4. **Testing**: Más fácil de testear composables aislados
5. **Performance**: Mejor optimización con code splitting

---

**Última actualización**: {{ fecha }}

