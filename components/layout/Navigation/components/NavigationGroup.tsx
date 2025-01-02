'use client';

import { type FC, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { type NavigationGroupProps, type NavigationItem } from '../types';
import { NavigationItemRenderer } from './NavigationItemRenderer';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const NavigationGroup: FC<NavigationGroupProps> = ({
  item,
  className,
  isCollapsed,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  // Auto-expand group if it contains the active item
  useEffect(() => {
    const hasActiveChild = item.items.some((subItem) => {
      if (subItem.type === 'item' && subItem.href) {
        return pathname?.startsWith(subItem.href);
      }
      return false;
    });

    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [pathname, item.items]);

  if (isCollapsed) {
    return (
      <div className={cn('space-y-1', className)}>
        {item.items.map((subItem: NavigationItem) => (
          <NavigationItemRenderer
            key={subItem.id}
            item={subItem}
            isCollapsed={isCollapsed}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn('space-y-1', className)}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1.5 text-sm font-semibold">
        {item.title}
        <ChevronRight
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-90'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-4 pt-1">
          {item.items.map((subItem: NavigationItem) => (
            <NavigationItemRenderer
              key={subItem.id}
              item={subItem}
              {...props}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

NavigationGroup.displayName = 'NavigationGroup';
