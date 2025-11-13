import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/features/auth/stores/authStore';

// Layouts - Lazy loaded
const OrganizationLayout = () => import('@/features/organization/layouts/OrganizationLayout.vue');
const VolunteerLayout = () => import('@/features/volunteer/layouts/VolunteerLayout.vue');

// General Views - Lazy loaded (except HomeView for faster initial load)
const HomeView = () => import('@/features/home/views/HomeView.vue');
const LoginView = () => import('@/features/auth/views/LoginView.vue');
const RegisterView = () => import('@/features/auth/views/RegisterView.vue');
const ForgotPasswordView = () => import('@/features/auth/views/ForgotPasswordView.vue');
const NotFoundView = () => import('@/features/error/views/NotFoundView.vue');

// Organization Views - Lazy loaded
const OrganizationDashboard = () => import('@/features/organization/dashboard/views/OrganizationDashboardView.vue');
const ProjectsView = () => import('@/features/organization/projects/views/ProjectsView.vue');
const CreateProjectView = () => import('@/features/organization/projects/views/CreateProjectView.vue');
const ProjectDetailView = () => import('@/features/organization/projects/views/ProjectDetailView.vue');
const VolunteersView = () => import('@/features/organization/views/VolunteersView.vue');
const DonationsView = () => import('@/features/organization/views/DonationsView.vue');
const ReportsView = () => import('@/features/organization/views/ReportsView.vue');
const OrganizationSettingsView = () => import('@/features/organization/views/SettingsView.vue');

// Volunteer Views - Lazy loaded
const VolunteerDashboard = () => import('@/features/volunteer/dashboard/views/VolunteerDashboardView.vue');
const MyProjectsView = () => import('@/features/volunteer/views/MyProjectsView.vue');
const VolunteerProfileView = () => import('@/features/volunteer/views/ProfileView.vue');
const AvailabilityView = () => import('@/features/volunteer/views/AvailabilityView.vue');
const VolunteerSettingsView = () => import('@/features/volunteer/views/SettingsView.vue');
const ProjectCatalogView = () => import('@/features/volunteer/views/ProjectCatalogView.vue');
const VolunteerProjectWorkspaceView = () => import('@/features/volunteer/views/VolunteerProjectWorkspaceView.vue');

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
        { path: 'dashboard/volunteers/invite', name: 'organization-invite-volunteer', component: VolunteersView },
        { path: 'dashboard/donations', name: 'organization-donations', component: DonationsView },
        { path: 'dashboard/donations/create', name: 'organization-create-donation', component: DonationsView },
        { path: 'dashboard/reports', name: 'organization-reports', component: ReportsView },
        { path: 'dashboard/analytics', name: 'organization-analytics', component: ReportsView },
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
        { path: 'catalog', name: 'volunteer-catalog', component: ProjectCatalogView },
        { path: 'my-projects', name: 'volunteer-my-projects', component: MyProjectsView },
        { path: 'projects', name: 'volunteer-projects', component: MyProjectsView },
        { path: 'projects/:id/workspace', name: 'volunteer-project-workspace', component: VolunteerProjectWorkspaceView },
        { path: 'projects/:id', name: 'volunteer-project-detail', component: ProjectCatalogView },
        { path: 'tasks', name: 'volunteer-tasks', component: MyProjectsView },
        { path: 'tasks/:id', name: 'volunteer-task-detail', component: MyProjectsView },
        { path: 'activity', name: 'volunteer-activity', component: MyProjectsView },
        { path: 'calendar', name: 'volunteer-calendar', component: AvailabilityView },
        { path: 'skills', name: 'volunteer-skills', component: VolunteerProfileView },
        { path: 'skills/add', name: 'volunteer-add-skill', component: VolunteerProfileView },
        { path: 'certificates', name: 'volunteer-certificates', component: VolunteerProfileView },
        { path: 'profile', name: 'volunteer-profile', component: VolunteerProfileView },
        { path: 'availability', name: 'volunteer-availability', component: AvailabilityView },
        { path: 'settings', name: 'volunteer-settings', component: VolunteerSettingsView },
      ],
    },
    // Common routes for all authenticated users - Lazy loaded
    {
      path: '/messages',
      name: 'messages',
      component: MyProjectsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: MyProjectsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: VolunteerProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: VolunteerSettingsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/auth/register-org',
      name: 'register-org',
      component: RegisterView
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
