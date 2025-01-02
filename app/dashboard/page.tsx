import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { NavigationItem } from '@/constants/navigation';
import { LayoutDashboard, Users } from 'lucide-react';

// Default navigation items with a default route
const defaultNav: NavigationItem[] = [
  {
    title: 'Overview',
    href: '/dashboard/overview',
    icon: LayoutDashboard,
    isDefault: true
  },
  {
    title: 'Clients',
    href: '/dashboard/clients',
    icon: Users
  }
];

const findDefaultRoute = (items: NavigationItem[] = defaultNav): string => {
  if (!items?.length) return '/dashboard/overview';

  for (const item of items) {
    if ('isDefault' in item && item.isDefault && item.href) {
      return item.href;
    }
    if (item.items) {
      const defaultInChildren = findDefaultRoute(item.items);
      if (defaultInChildren) return defaultInChildren;
    }
  }
  return '/dashboard/overview'; // Fallback default
};

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const defaultRoute = findDefaultRoute(defaultNav);
  redirect(defaultRoute);
}
