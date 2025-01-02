'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';

export function Breadcrumbs() {
  const items = useBreadcrumbs();
  if (items.length === 0) return null;

  return (
    <Breadcrumb>
      {items.map((item, index) => (
        <BreadcrumbItem
          key={item.title}
          href={index !== items.length - 1 ? item.link : undefined}
          isCurrentPage={index === items.length - 1}
          className="hidden md:inline-flex"
        >
          {item.title}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
