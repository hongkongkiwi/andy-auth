import type { NavigationItem } from '@/components/layout/Navigation/types';

export const noWorkspaceNavItems: NavigationItem[] = [];

export const workspaceNavItems: NavigationItem[] = [
  {
    id: 'overview',
    type: 'item',
    title: 'Overview',
    icon: 'dashboard',
    href: '/dashboard/overview'
  },
  {
    id: 'clients',
    type: 'item',
    title: 'Clients',
    icon: 'users',
    href: '/dashboard/clients'
  },
  {
    id: 'guards',
    type: 'item',
    title: 'Guards',
    icon: 'shield',
    href: '/dashboard/guards'
  },
  {
    id: 'devices',
    type: 'item',
    title: 'Devices',
    icon: 'smartphone',
    href: '/dashboard/devices'
  },
  {
    id: 'users',
    type: 'item',
    title: 'Users',
    icon: 'users',
    href: '/dashboard/users'
  },
  {
    id: 'settings',
    type: 'item',
    title: 'Settings',
    icon: 'settings',
    href: '/dashboard/settings'
  }
]; 

export const clientNavItems: NavigationItem[] = [
  {
    id: 'client-overview',
    type: 'item',
    title: 'Overview',
    icon: 'dashboard',
    href: '/dashboard/overview'
  },
  {
    id: 'client-incidents',
    type: 'item',
    title: 'Incidents',
    icon: 'alert-triangle',
    href: '/dashboard/incidents'
  },
  {
    id: 'client-reports',
    type: 'item',
    title: 'Reports',
    icon: 'file-text',
    href: '/dashboard/reports'
  },
  {
    id: 'client-locations',
    type: 'item',
    title: 'Locations',
    icon: 'map-pin',
    href: '/dashboard/locations'
  },
  {
    id: 'client-guards',
    type: 'item',
    title: 'Guards',
    icon: 'shield',
    href: '/dashboard/guards'
  },
  {
    id: 'client-devices',
    type: 'item',
    title: 'Devices',
    icon: 'smartphone',
    href: '/dashboard/devices'
  },
  {
    id: 'client-settings',
    type: 'item',
    title: 'Settings',
    icon: 'settings',
    href: '/dashboard/settings'
  }
]; 