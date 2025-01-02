'use client';

import { type FC } from 'react';
import { cn } from '@/lib/utils';
import { type NavigationHeaderProps } from '../types';

export const NavigationHeader: FC<NavigationHeaderProps> = ({
  item,
  className,
  isCollapsed
}) => {
  if (!item.title || isCollapsed) return null;

  return (
    <div className={cn('mb-2 px-2 py-1.5', className)}>
      <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
    </div>
  );
};

NavigationHeader.displayName = 'NavigationHeader';
