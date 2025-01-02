'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
}

interface BreadcrumbItemProps {
  children: React.ReactNode;
  href?: string;
  isCurrentPage?: boolean;
  className?: string;
}

export function BreadcrumbItem({
  children,
  href,
  isCurrentPage = false,
  className
}: BreadcrumbItemProps) {
  const content = (
    <span
      className={cn(
        'text-sm',
        isCurrentPage
          ? 'font-medium text-foreground'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      {children}
    </span>
  );

  if (href && !isCurrentPage) {
    return (
      <Link href={href} className="hover:underline">
        {content}
      </Link>
    );
  }

  return content;
}

export function Breadcrumb({ children, className }: BreadcrumbProps) {
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <nav aria-label="breadcrumb" className={className}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
            )}
            {item}
          </li>
        ))}
      </ol>
    </nav>
  );
}
