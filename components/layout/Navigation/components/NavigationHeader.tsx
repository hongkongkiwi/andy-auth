'use client';

import { cn } from "@/lib/utils";
import { NavigationHeader as NavigationHeaderType } from "../types";

type NavigationHeaderProps = {
  item: NavigationHeaderType;
  level?: number;
};

export const NavigationHeader = ({ 
  item: { title, className },
  level = 0 
}: NavigationHeaderProps) => (
  <div className={cn(
    "px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
    level > 0 && "pl-4",
    className
  )}>
    {title}
  </div>
); 