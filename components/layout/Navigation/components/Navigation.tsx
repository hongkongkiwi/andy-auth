'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import { NavigationProps } from '../types';
import { NavigationItemRenderer } from './NavigationItemRenderer';

export const Navigation: React.FC<NavigationProps> = ({ 
  items, 
  label,
  className,
  ...props
}) => {
  return (
    <SidebarGroup className={cn("-mt-2", className)}>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <NavigationItemRenderer
            key={item.id}
            item={item}
            {...props}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}; 