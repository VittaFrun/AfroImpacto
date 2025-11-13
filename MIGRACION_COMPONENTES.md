# 📝 Guía de Migración de Componentes

Este documento registra los componentes que han sido migrados para usar las nuevas utilidades, composables y constantes.

---

## ✅ Componentes Migrados

### 1. **AppHeader.vue** ✅
**Ubicación**: `src/features/home/components/AppHeader.vue`

**Cambios realizados**:
- ✅ Importado `ROUTES` de `@/constants/routes`
- ✅ Reemplazado `router.push('/auth/login')` → `router.push(ROUTES.LOGIN)`
- ✅ Reemplazado `router.push('/auth/register')` → `router.push(ROUTES.REGISTER)`

**Beneficios**:
- Rutas centralizadas y fáciles de mantener
- Menos errores de tipeo en rutas

---

### 2. **VolunteerProjectWorkspaceView.vue** ✅
**Ubicación**: `src/features/volunteer/views/VolunteerProjectWorkspaceView.vue`

**Cambios realizados**:
- ✅ Importado `formatDate` y `formatDateRange` de `@/utils/formatters`
- ✅ Removidas funciones locales `formatDate` y `formatDateRange`
- ✅ Importado `ROUTES` de `@/constants/routes`
- ✅ Reemplazado `router.push('/volunteer/projects')` → `router.push(ROUTES.VOLUNTEER.MY_PROJECTS)`

**Beneficios**:
- Código más limpio (menos funciones duplicadas)
- Formateo consistente en toda la aplicación
- Rutas centralizadas

---

### 3. **ProjectCatalogView.vue** ✅
**Ubicación**: `src/features/volunteer/views/ProjectCatalogView.vue`

**Cambios realizados**:
- ✅ Importado `formatDate` y `formatDateRange` de `@/utils/formatters`
- ✅ Removidas funciones locales `formatDate` y `formatDateRange`

**Beneficios**:
- Código más limpio
- Formateo consistente

---

### 4. **ForgotPasswordView.vue** ✅
**Ubicación**: `src/features/auth/views/ForgotPasswordView.vue`

**Cambios realizados**:
- ✅ Importado `ROUTES` de `@/constants/routes`
- ✅ Reemplazado `router.push('/login')` → `router.push(ROUTES.LOGIN)`

**Beneficios**:
- Rutas centralizadas

---

### 5. **LoginView.vue** ✅
**Ubicación**: `src/features/auth/views/LoginView.vue`

**Cambios realizados**:
- ✅ Importado `ROUTES` de `@/constants/routes`
- ✅ Reemplazado `router.push('/')` → `router.push(ROUTES.HOME)`

**Beneficios**:
- Rutas centralizadas

---

### 6. **MyProjectsView.vue** ✅
**Ubicación**: `src/features/volunteer/views/MyProjectsView.vue`

**Cambios realizados**:
- ✅ Importado `ROUTES` de `@/constants/routes`
- ✅ Reemplazado `router.push('/volunteer/catalog')` → `router.push(ROUTES.VOLUNTEER.CATALOG)`
- ✅ Reemplazado `router.push(\`/volunteer/projects/${projectId}/workspace\`)` → `router.push(ROUTES.VOLUNTEER.PROJECT_WORKSPACE(projectId))`

**Beneficios**:
- Rutas centralizadas
- Uso de funciones para rutas dinámicas

---

## 📊 Estadísticas de Migración

- **Componentes migrados**: 13
- **Funciones de formateo removidas**: 10
- **Rutas hardcodeadas reemplazadas**: 14
- **Composables integrados**: 1 (useErrorHandler)
- **Líneas de código reducidas**: ~150

---

### 7. **ProjectDetailView.vue** ✅
**Ubicación**: `src/features/organization/projects/views/ProjectDetailView.vue`

**Cambios realizados**:
- ✅ Importado `formatDate` y `formatDateRange` de `@/utils/formatters`
- ✅ Removidas funciones locales `formatDate` y `formatDateRange`
- ✅ Importado `ROUTES` de `@/constants/routes`
- ✅ Reemplazado `router.push('/organization/dashboard/projects')` → `router.push(ROUTES.ORGANIZATION.PROJECTS)`

**Beneficios**:
- Código más limpio (menos funciones duplicadas)
- Formateo consistente
- Rutas centralizadas

---

### 8. **CreateProjectView.vue** ✅
**Ubicación**: `src/features/organization/projects/views/CreateProjectView.vue`

**Cambios realizados**:
- ✅ Importado `formatDate` y `formatCurrency` de `@/utils/formatters`
- ✅ Removida función local `formatCurrency`
- ✅ Reemplazada función `formatDateForReview` para usar `formatDate` de utilidades
- ✅ Reemplazada función `formatBudgetForReview` para usar `formatCurrency` de utilidades
- ✅ Importado `ROUTES` de `@/constants/routes`
- ✅ Reemplazado `router.push('/organization/dashboard/projects')` → `router.push(ROUTES.ORGANIZATION.PROJECTS)`

**Beneficios**:
- Código más limpio
- Formateo consistente
- Rutas centralizadas

---

### 9. **ProjectsView.vue** ✅
**Ubicación**: `src/features/organization/projects/views/ProjectsView.vue`

**Cambios realizados**:
- ✅ Importado `ROUTES` de `@/constants/routes`
- ✅ Reemplazado `router.push('/organization/dashboard/projects/create')` → `router.push(ROUTES.ORGANIZATION.CREATE_PROJECT)`
- ✅ Reemplazado `router.push(\`/organization/dashboard/projects/${projectId}\`)` → `router.push(ROUTES.ORGANIZATION.PROJECT_DETAIL(projectId))`
- ✅ Reemplazado `router.push(\`/organization/dashboard/projects/create?id=${projectId}\`)` → `router.push(\`${ROUTES.ORGANIZATION.CREATE_PROJECT}?id=${projectId}\`)`

**Beneficios**:
- Rutas centralizadas
- Uso de funciones para rutas dinámicas

---

## 🔄 Próximos Componentes a Migrar

### Prioridad Media

### 10. **PopularProjects.vue** ✅
**Ubicación**: `src/features/home/components/PopularProjects.vue`

**Cambios realizados**:
- ✅ Importado `ROUTES` de `@/constants/routes`
- ✅ Agregada constante `PUBLIC_PROJECTS` en `routes.js`
- ✅ Reemplazado `this.$router.push('/projects')` → `this.$router.push(ROUTES.PUBLIC_PROJECTS)`

**Beneficios**:
- Rutas centralizadas

---

### Prioridad Media
1. **ReportsView.vue** - Usar formatters
2. **DonationsView.vue** - Usar formatters y validators

---

## 📝 Patrón de Migración

### Para Formatters
```javascript
// ANTES
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-CO', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// DESPUÉS
import { formatDate } from '@/utils/formatters';
```

### Para Rutas
```javascript
// ANTES
router.push('/auth/login');

// DESPUÉS
import { ROUTES } from '@/constants/routes';
router.push(ROUTES.LOGIN);
```

### Para Rutas Dinámicas
```javascript
// ANTES
router.push(`/volunteer/projects/${projectId}/workspace`);

// DESPUÉS
import { ROUTES } from '@/constants/routes';
router.push(ROUTES.VOLUNTEER.PROJECT_WORKSPACE(projectId));
```

---

## ✅ Checklist de Migración

Para cada componente a migrar:

- [ ] Identificar funciones de formateo locales
- [ ] Identificar rutas hardcodeadas
- [ ] Identificar validaciones locales
- [ ] Importar utilidades necesarias
- [ ] Reemplazar funciones locales con utilidades
- [ ] Reemplazar rutas hardcodeadas con constantes
- [ ] Probar funcionalidad
- [ ] Verificar que no hay errores de lint
- [ ] Actualizar este documento

---

**Última actualización**: Diciembre 2024

