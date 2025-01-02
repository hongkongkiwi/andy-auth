'use client';

import { type FC } from 'react';
import { cn } from '@/lib/utils';
import { type NavigationProps } from '../types';
import { NavigationItemRenderer } from './NavigationItemRenderer';

export const Navigation: FC<NavigationProps> = ({
  items,
  label = 'Main Navigation',
  className,
  isCollapsed,
  ...props
}) => (
  <nav
    aria-label={label}
    className={cn(
      'flex flex-col gap-2 p-2',
      isCollapsed && 'w-[70px]',
      className
    )}
  >
    {items.map((item) => (
      <NavigationItemRenderer
        key={item.id}
        item={item}
        isCollapsed={isCollapsed}
        {...props}
      />
    ))}
  </nav>
);

Navigation.displayName = 'Navigation:Root';
