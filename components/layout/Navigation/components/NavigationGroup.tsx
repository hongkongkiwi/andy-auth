'use client';

import * as React from 'react';
import { cn } from "@/lib/utils";
import { NavigationGroup as NavigationGroupType } from "../types";

type NavigationGroupProps = {
  item: NavigationGroupType;
  level?: number;
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

const NavigationGroup = React.memo(({
  item: { title, className },
  level = 0,
  isCollapsed,
  onToggle,
  children
}: NavigationGroupProps) => (
  <div className={cn("space-y-1", className)}>
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center px-2 py-1.5",
        "text-sm font-medium",
        "hover:bg-accent/50 rounded-md",
        level > 0 && "pl-4"
      )}
    >
      <span>{title}</span>
    </button>
    <div className={cn(
      "space-y-1 overflow-hidden transition-all",
      isCollapsed ? "h-0" : "h-auto",
      level > 0 && "ml-2"
    )}>
      {children}
    </div>
  </div>
));

NavigationGroup.displayName = 'NavigationGroup';

export { NavigationGroup }; 