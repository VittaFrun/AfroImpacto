import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { createLazyComponent } from '@/utils/lazyLoad';

// Layouts - Lazy loaded with error handling
const OrganizationLayout = createLazyComponent(
  () => import('@/features/organization/layouts/OrganizationLayout.vue'),
  { delay: 0 }
);
const VolunteerLayout = createLazyComponent(
  () => import('@/features/volunteer/layouts/VolunteerLayout.vue'),
  { delay: 0 }
);

// General Views - Lazy loaded with error handling
const HomeView = createLazyComponent(() => import('@/features/home/views/HomeView.vue'));
const LoginView = createLazyComponent(() => import('@/features/auth/views/LoginView.vue'));
const RegisterView = createLazyComponent(() => import('@/features/auth/views/RegisterView.vue'));
const ForgotPasswordView = createLazyComponent(() => import('@/features/auth/views/ForgotPasswordView.vue'));
const NotFoundView = createLazyComponent(() => import('@/features/error/views/NotFoundView.vue'));

// Organization Views - Lazy loaded with error handling
const OrganizationDashboard = createLazyComponent(() => import('@/features/organization/dashboard/views/OrganizationDashboardView.vue'));
const ProjectsView = createLazyComponent(() => import('@/features/organization/projects/views/ProjectsView.vue'));
const CreateProjectView = createLazyComponent(() => import('@/features/organization/projects/views/CreateProjectView.vue'));
const ProjectDetailView = createLazyComponent(() => import('@/features/organization/projects/views/ProjectDetailView.vue'));
const TeamManagementView = createLazyComponent(() => import('@/features/organization/team/views/TeamManagementView.vue'));
const DonationsView = createLazyComponent(() => import('@/features/organization/views/DonationsView.vue'));
const ReportsView = createLazyComponent(() => import('@/features/organization/views/ReportsView.vue'));
const OrganizationSettingsView = createLazyComponent(() => import('@/features/organization/views/SettingsView.vue'));
// Settings Components - Lazy loaded
const ProfileSettings = createLazyComponent(() => import('@/features/organization/settings/components/ProfileSettings.vue'));
const AccountSettings = createLazyComponent(() => import('@/features/organization/settings/components/AccountSettings.vue'));
const PreferencesSettings = createLazyComponent(() => import('@/features/organization/settings/components/PreferencesSettings.vue'));
const SecuritySettings = createLazyComponent(() => import('@/features/organization/settings/components/SecuritySettings.vue'));
const IntegrationsSettings = createLazyComponent(() => import('@/features/organization/settings/components/IntegrationsSettings.vue'));
const OrganizationProfileView = createLazyComponent(() => import('@/features/organization/profile/views/OrganizationProfileView.vue'));

// Volunteer Views - Lazy loaded with error handling
const VolunteerDashboard = createLazyComponent(() => import('@/features/volunteer/dashboard/views/VolunteerDashboardView.vue'));
const MyProjectsView = createLazyComponent(() => import('@/features/volunteer/views/MyProjectsView.vue'));
const VolunteerProfileView = createLazyComponent(() => import('@/features/volunteer/views/ProfileView.vue'));
const AvailabilityView = createLazyComponent(() => import('@/features/volunteer/views/AvailabilityView.vue'));
const VolunteerSettingsView = createLazyComponent(() => import('@/features/volunteer/views/SettingsView.vue'));
const ProjectCatalogView = createLazyComponent(() => import('@/features/volunteer/views/ProjectCatalogView.vue'));
const VolunteerProjectWorkspaceView = createLazyComponent(() => import('@/features/volunteer/views/VolunteerProjectWorkspaceView.vue'));
const OrganizationsCatalogView = createLazyComponent(() => import('@/features/volunteer/organizations/views/OrganizationsCatalogView.vue'));

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
    // Ruta pública para ver perfiles de organizaciones
    { 
      path: '/organizations/:id', 
      name: 'organization-public-profile', 
      component: OrganizationProfileView,
      meta: { requiresAuth: false }
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
        { path: 'dashboard/team', name: 'organization-team', component: TeamManagementView },
        { path: 'dashboard/donations', name: 'organization-donations', component: DonationsView },
        { path: 'dashboard/donations/create', name: 'organization-create-donation', component: DonationsView },
        { path: 'dashboard/reports', name: 'organization-reports', component: ReportsView },
        { path: 'dashboard/analytics', name: 'organization-analytics', component: ReportsView },
        { 
          path: 'dashboard/settings', 
          name: 'organization-settings', 
          component: OrganizationSettingsView,
          redirect: '/organization/dashboard/settings/profile',
          children: [
            {
              path: 'profile',
              name: 'organization-settings-profile',
              component: OrganizationProfileView
            },
            {
              path: 'account',
              name: 'organization-settings-account',
              component: AccountSettings
            },
            {
              path: 'preferences',
              name: 'organization-settings-preferences',
              component: PreferencesSettings
            },
            {
              path: 'security',
              name: 'organization-settings-security',
              component: SecuritySettings
            },
            {
              path: 'integrations',
              name: 'organization-settings-integrations',
              component: IntegrationsSettings
            }
          ]
        },
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
        { path: 'organizations', name: 'volunteer-organizations', component: OrganizationsCatalogView },
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
      component: createLazyComponent(() => import('@/features/messages/views/MessagesView.vue')),
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

// Prefetch de rutas relacionadas cuando el usuario está inactivo
if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Prefetch de rutas comunes basado en el rol del usuario
    const authStore = useAuthStore();
    if (authStore.isAuthenticated) {
      if (authStore.userRole === 'organizacion') {
        // Prefetch de rutas de organización
        import('@/features/organization/projects/views/ProjectsView.vue');
        import('@/features/organization/team/views/TeamManagementView.vue');
      } else if (authStore.userRole === 'voluntario') {
        // Prefetch de rutas de voluntario
        import('@/features/volunteer/views/MyProjectsView.vue');
        import('@/features/volunteer/views/ProjectCatalogView.vue');
      }
    }
  }, { timeout: 3000 });
}

export default router;
