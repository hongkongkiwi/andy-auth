import { LayoutDashboard, Users, Settings } from 'lucide-react';
import type { NavigationItem } from '@/constants/types';

export const workspaceNavItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    isDefault: true
  },
  {
    id: 'clients',
    title: 'Clients',
    href: '/dashboard/clients',
    icon: Users
  }
];

export const noWorkspaceNavItems: NavigationItem[] = [
  {
    id: 'settings',
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings
  }
];

export const clientNavItems: NavigationItem[] = [
  {
    id: 'overview',
    title: 'Overview',
    href: '/dashboard/clients/:id',
    icon: LayoutDashboard
  }
];
