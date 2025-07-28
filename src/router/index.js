import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../features/home/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../features/auth/views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../features/auth/views/RegisterView.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../features/auth/views/ForgotPasswordView.vue')
  },
  {
    path: '/organization/dashboard',
    name: 'organization-dashboard',
    component: () => import('../features/organization/views/OrganizationDashboardView.vue'),
    meta: { transition: 'slide-fade' },
    children: [
      {
        path: '', // Ruta por defecto para /organization/dashboard
        name: 'dashboard-home',
        component: () => import('../features/organization/views/DashboardHomeView.vue'),
        meta: { transition: 'slide-fade' }
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('../features/organization/projects/views/ProjectsView.vue'),
        meta: { transition: 'slide-fade' }
      },
      {
        path: 'projects/create',
        name: 'create-project',
        component: () => import('../features/organization/projects/views/CreateProjectView.vue'),
        meta: { transition: 'slide-fade' }
      },
      {
        path: 'projects/:id',
        name: 'project-details',
        component: () => import('../features/organization/projects/views/ProjectDetailView.vue'),
        meta: { transition: 'slide-fade' }
      },
      // Aquí se pueden añadir más rutas hijas para el dashboard de organización
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../features/error/views/NotFoundView.vue')
  },
  {
    path: '/error',
    name: 'generic-error',
    component: () => import('../features/error/views/GenericErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router