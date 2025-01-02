import { LayoutDashboard, Users, Building2, Shield } from 'lucide-react';

export const mainNav = [
  {
    title: 'Overview',
    url: '/dashboard/overview',
    icon: LayoutDashboard,
    isDefault: true
  },
  {
    title: 'Clients',
    url: '/dashboard/clients',
    icon: Building2
  },
  {
    title: 'Guards',
    url: '/dashboard/guards',
    icon: Shield
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: Users
  }
] as const;

export type MainNavItem = (typeof mainNav)[number];
