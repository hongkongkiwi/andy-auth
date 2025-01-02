'use client';

import { type FC, memo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip';
import { type NavigationMenuItemProps } from '../types';
import { useNavigationItem } from '../hooks';

export const NavigationMenuItem: FC<NavigationMenuItemProps> = memo(
  ({ item, level = 0, isCollapsed, showIcons = true, iconSize = 4 }) => {
    const { isActive, handleClick, isDisabled } = useNavigationItem(item);
    const Icon = item.icon ? Icons[item.icon] : null;

    const linkContent = (
      <>
        {showIcons && Icon && (
          <Icon
            className={cn(
              `size-${iconSize}`,
              isCollapsed && `size-${iconSize + 1}`,
              'mr-2'
            )}
          />
        )}
        {!isCollapsed && <span>{item.title}</span>}
      </>
    );

    const button = (
      <Button
        asChild
        variant={isActive ? 'secondary' : 'ghost'}
        disabled={isDisabled}
        className={cn(
          'w-full justify-start',
          level > 0 && 'pl-6',
          isActive && 'bg-accent font-medium text-accent-foreground',
          isDisabled && 'cursor-not-allowed opacity-50'
        )}
        onClick={handleClick}
      >
        <Link href={item.href || '#'}>{linkContent}</Link>
      </Button>
    );

    if (!isCollapsed) return button;

    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="flex items-center"
            sideOffset={8}
          >
            {item.title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

NavigationMenuItem.displayName = 'Navigation:MenuItem';
