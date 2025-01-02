'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Guard } from '@/constants/mock-api';

interface BreadcrumbsProps {
  guard: Guard | null;
}

export function Breadcrumbs({ guard }: BreadcrumbsProps) {
  return (
    <div className="mb-4">
      <Breadcrumb>
        <BreadcrumbItem href="/dashboard" className="hidden md:inline-flex">
          Dashboard
        </BreadcrumbItem>
        <BreadcrumbItem
          href="/dashboard/guards"
          className="hidden md:inline-flex"
        >
          Guards
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          {guard ? guard.name : 'Loading...'}
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
