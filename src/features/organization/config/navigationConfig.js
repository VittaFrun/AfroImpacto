/**
 * Configuración centralizada del menú de navegación
 * Facilita el mantenimiento y la escalabilidad del menú
 */
export const navigationItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    route: '/organization/dashboard',
    exact: true
  },
  {
    id: 'projects',
    title: 'Proyectos',
    icon: 'mdi-folder-multiple',
    type: 'group',
    children: [
      {
        id: 'all-projects',
        title: 'Gestion Proyectos',
        icon: 'mdi-view-list',
        route: '/organization/dashboard/projects'
      },
      {
        id: 'create-project',
        title: 'Crear Proyecto',
        icon: 'mdi-plus-circle',
        route: '/organization/dashboard/projects/create'
      }
    ]
  },
  {
    id: 'team',
    title: 'Equipo',
    icon: 'mdi-account-group',
    route: '/organization/dashboard/team'
  },
  {
    id: 'donations',
    title: 'Donaciones',
    icon: 'mdi-cash-multiple',
    route: '/organization/dashboard/donations'
  },
  {
    id: 'reports',
    title: 'Reportes',
    icon: 'mdi-file-chart',
    route: '/organization/dashboard/reports'
  },
  {
    id: 'messages',
    title: 'Mensajes',
    icon: 'mdi-message-text',
    route: '/messages',
    badge: 'unread' // Se puede actualizar dinámicamente con el contador
  },
  {
    id: 'settings',
    title: 'Configuración',
    icon: 'mdi-cog',
    type: 'group',
    children: [
      {
        id: 'profile',
        title: 'Perfil e Identidad',
        icon: 'mdi-account-box',
        route: '/organization/dashboard/settings/profile'
      },
      {
        id: 'account',
        title: 'Cuenta',
        icon: 'mdi-account-key',
        route: '/organization/dashboard/settings/account'
      },
      {
        id: 'preferences',
        title: 'Preferencias',
        icon: 'mdi-cog',
        route: '/organization/dashboard/settings/preferences'
      },
      {
        id: 'security',
        title: 'Seguridad',
        icon: 'mdi-shield-check',
        route: '/organization/dashboard/settings/security'
      },
      {
        id: 'integrations',
        title: 'Integraciones',
        icon: 'mdi-puzzle',
        route: '/organization/dashboard/settings/integrations'
      }
    ]
  }
]

