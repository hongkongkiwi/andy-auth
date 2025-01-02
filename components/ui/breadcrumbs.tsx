'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useClient } from '@/components/layout/ClientSwitcher/hooks/useClient';

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const { selectedClient } = useClient();
  const paths = pathname.split('/').filter(Boolean);

  const getBreadcrumbLabel = (path: string, index: number) => {
    // If this is a client ID and we have a selected client
    if (selectedClient && path === selectedClient.id) {
      return selectedClient.name;
    }

    // Default formatting
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        const label = getBreadcrumbLabel(path, index);

        return (
          <div key={path} className="flex items-center">
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4" />}
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link
                href={href}
                className="transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};
