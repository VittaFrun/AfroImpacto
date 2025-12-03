export const navigationItems = [
  {
    id: 'messages',
    title: 'Mensajes',
    icon: 'mdi-message-text',
    route: '/messages',
    type: 'item'
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    route: '/volunteer/dashboard',
    type: 'item',
    exact: true
  },
  {
    id: 'projects',
    title: 'Mis Proyectos',
    icon: 'mdi-folder-heart',
    route: '/volunteer/projects',
    type: 'item'
  },
  {
    id: 'organizations',
    title: 'Organizaciones',
    icon: 'mdi-domain',
    route: '/volunteer/organizations',
    type: 'item'
  },
  {
    id: 'profile',
    title: 'Mi Perfil',
    icon: 'mdi-account-star',
    route: '/volunteer/profile',
    type: 'item'
  },
  {
    id: 'availability',
    title: 'Disponibilidad',
    icon: 'mdi-calendar-clock',
    route: '/volunteer/availability',
    type: 'item'
  },
  {
    id: 'settings',
    title: 'Configuración',
    icon: 'mdi-cog',
    route: '/volunteer/settings',
    type: 'item'
  }
];

