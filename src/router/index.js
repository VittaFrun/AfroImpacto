import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/features/auth/stores/authStore';

// Layouts
import OrganizationLayout from '@/features/organization/layouts/OrganizationLayout.vue';
import VolunteerLayout from '@/features/volunteer/layouts/VolunteerLayout.vue';

// General Views
import HomeView from '@/features/home/views/HomeView.vue';
import LoginView from '@/features/auth/views/LoginView.vue';
import RegisterView from '@/features/auth/views/RegisterView.vue';
import ForgotPasswordView from '@/features/auth/views/ForgotPasswordView.vue';
import NotFoundView from '@/features/error/views/NotFoundView.vue';

// Organization Views
import OrganizationDashboard from '@/features/organization/views/DashboardHomeView.vue';
import ProjectsView from '@/features/organization/projects/views/ProjectsView.vue';
import CreateProjectView from '@/features/organization/projects/views/CreateProjectView.vue';
import ProjectDetailView from '@/features/organization/projects/views/ProjectDetailView.vue';
import VolunteersView from '@/features/organization/views/VolunteersView.vue';
import DonationsView from '@/features/organization/views/DonationsView.vue';
import ReportsView from '@/features/organization/views/ReportsView.vue';
import OrganizationSettingsView from '@/features/organization/views/SettingsView.vue';

// Volunteer Views
import VolunteerDashboard from '@/features/volunteer/views/DashboardHomeView.vue';
import MyProjectsView from '@/features/volunteer/views/MyProjectsView.vue';
import VolunteerProfileView from '@/features/volunteer/views/ProfileView.vue';
import AvailabilityView from '@/features/volunteer/views/AvailabilityView.vue';
import VolunteerSettingsView from '@/features/volunteer/views/SettingsView.vue';

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
        { path: 'dashboard/volunteers', name: 'organization-volunteers', component: VolunteersView },
        { path: 'dashboard/donations', name: 'organization-donations', component: DonationsView },
        { path: 'dashboard/reports', name: 'organization-reports', component: ReportsView },
        { path: 'dashboard/settings', name: 'organization-settings', component: OrganizationSettingsView },
      ],
    },
    {
      path: '/volunteer',
      component: VolunteerLayout,
      meta: { requiresAuth: true, role: 'voluntario' },
      redirect: '/volunteer/dashboard',
      children: [
        { path: 'dashboard', name: 'volunteer-dashboard', component: VolunteerDashboard },
        { path: 'projects', name: 'volunteer-projects', component: MyProjectsView },
        { path: 'profile', name: 'volunteer-profile', component: VolunteerProfileView },
        { path: 'availability', name: 'volunteer-availability', component: AvailabilityView },
        { path: 'settings', name: 'volunteer-settings', component: VolunteerSettingsView },
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
