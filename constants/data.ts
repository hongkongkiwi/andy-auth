import { NavItem } from '@/types';

// Only keep the navigation-related constants since the data is in mock-api.ts
export const generalNavItems: NavItem[] = [
  {
    title: 'Overview',
    url: '/dashboard/overview',
    icon: 'overview',
    label: 'Overview',
    isDefault: true,
  },
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
  },
];

export const navItems: NavItem[] = [
  {
    title: 'Clients',
    url: '/dashboard/clients',
    icon: 'clients',
    label: 'Clients',
    items: [
      {
        title: 'All Clients',
        url: '/dashboard/clients',
        icon: 'clientsList',
        label: 'All Clients',
      },
      {
        title: 'Locations',
        url: '/dashboard/clients/:clientId/locations',
        icon: 'location',
        label: 'Locations',
      },
      {
        title: 'Location Map',
        url: '/dashboard/clients/:clientId/locations/map',
        icon: 'map',
        label: 'Location Map',
      }
    ],
  },
];

export const workspaceAdminNavItems: NavItem[] = [
  {
    title: 'Devices',
    url: '/dashboard/devices',
    icon: 'device',
    label: 'Devices',
  },
  {
    title: 'Guards',
    url: '/dashboard/guards',
    icon: 'guard',
    label: 'Guards',
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: 'user',
    label: 'Users',
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: 'settings',
    label: 'Settings',
  },
];

export const clientNavItems: NavItem[] = [
  {
    title: 'Incidents',
    url: '/dashboard/clients/1/incidents',
    icon: 'incident',
    label: 'Incidents',
    permissions: ['READ_INCIDENT'],
  },
  {
    title: 'Reports',
    url: '/dashboard/clients/1/reports',
    icon: 'report',
    label: 'Reports',
    permissions: ['READ_REPORT'],
  },
  {
    title: 'Locations',
    url: '/dashboard/clients/1/locations',
    icon: 'location',
    label: 'Locations',
    permissions: ['READ_LOCATION'],
  },
  {
    title: 'Guards',
    url: '/dashboard/clients/1/guards',
    icon: 'guard',
    label: 'Guards',
    permissions: ['READ_GUARD'],
  },
  {
    title: 'Devices',
    url: '/dashboard/clients/1/devices',
    icon: 'device',
    label: 'Devices',
    permissions: ['READ_DEVICE'],
  },
  {
    title: 'Client Settings',
    url: '/dashboard/clients/1/settings',
    icon: 'settings',
    label: 'Settings',
    permissions: ['READ_SETTINGS'],
  },
];