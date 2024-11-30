import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { mainNav } from '@/constants/data';

const findDefaultRoute = (items: typeof mainNav): string => {
  for (const item of items) {
    if (item.isDefault) return item.url;
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
    return redirect('/');
  } else {
    const defaultRoute = findDefaultRoute(mainNav);
    redirect(defaultRoute);
  }
}
