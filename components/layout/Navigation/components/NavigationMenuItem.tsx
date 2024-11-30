'use client';

import * as React from 'react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "../types";
import { Icons } from "@/components/icons";
import type { IconsType } from "@/types";

type NavigationMenuItemProps = {
  item: NavigationLink;
  level?: number;
  isActive?: boolean;
  showIcons?: boolean;
  iconSize?: number;
};

const NavigationMenuItem = React.memo(({ 
  item: { href, title, icon, iconClassName },
  level = 0,
  isActive,
  showIcons = true,
  iconSize = 4
}: NavigationMenuItemProps) => {
  const Icon = icon ? Icons[icon as IconsType] : null;

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        'w-full justify-start',
        level > 0 && 'pl-6',
        isActive && 'bg-muted'
      )}
    >
      <Link href={href}>
        {showIcons && Icon && (
          <Icon className={cn(
            `h-${iconSize} w-${iconSize} mr-2`,
            iconClassName
          )} />
        )}
        <span>{title}</span>
      </Link>
    </Button>
  );
});

NavigationMenuItem.displayName = 'NavigationMenuItem';

export { NavigationMenuItem }; 