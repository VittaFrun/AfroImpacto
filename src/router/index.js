import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/features/auth/stores/authStore';

// Layouts
import AuthLayout from '@/layouts/AuthLayout.vue';
import OrganizationLayout from '@/features/organization/layouts/OrganizationLayout.vue';
import VolunteerLayout from '@/features/volunteer/layouts/VolunteerLayout.vue';

// Views
import HomeView from '@/features/home/views/HomeView.vue';
import LoginView from '@/features/auth/views/LoginView.vue';
import RegisterView from '@/features/auth/views/RegisterView.vue';
import ForgotPasswordView from '@/features/auth/views/ForgotPasswordView.vue';
import OrganizationDashboard from '@/features/organization/views/DashboardHomeView.vue';
import ProjectsView from '@/features/organization/projects/views/ProjectsView.vue';
import CreateProjectView from '@/features/organization/projects/views/CreateProjectView.vue';
import ProjectDetailView from '@/features/organization/projects/views/ProjectDetailView.vue';
import VolunteerDashboard from '@/features/volunteer/views/DashboardHomeView.vue';
import NotFoundView from '@/features/error/views/NotFoundView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/auth/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/auth/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView
    },
    {
      path: '/organization',
      component: OrganizationLayout,
      meta: { requiresAuth: true, role: 'organizacion' },
      redirect: '/organization/dashboard',
      children: [
        { path: 'dashboard', name: 'organization-dashboard', component: OrganizationDashboard },
        { path: 'dashboard/projects', name: 'organization-projects', component: ProjectsView },
        { path: 'dashboard/projects/create', name: 'organization-create-project', component: CreateProjectView },
        { path: 'dashboard/projects/:id', name: 'organization-project-detail', component: ProjectDetailView },
      ],
    },
    {
      path: '/volunteer',
      component: VolunteerLayout,
      meta: { requiresAuth: true, role: 'voluntario' },
      redirect: '/volunteer/dashboard',
      children: [
        { path: 'dashboard', name: 'volunteer-dashboard', component: VolunteerDashboard },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRole = to.meta.role;

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (requiresAuth && requiredRole && authStore.userRole !== requiredRole) {
    if (authStore.userRole === 'organizacion') {
      next({ name: 'organization-dashboard' });
    } else if (authStore.userRole === 'voluntario') {
      next({ name: 'volunteer-dashboard' });
    } else {
      next({ name: 'login' });
    }
  } else {
    next();
  }
});

export default router;
