'use client';

import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RouterOutputs } from '@/lib/trpc/client';

type WorkspaceFromAPI = RouterOutputs['workspaces']['list'][0];
type BrandingType = { backgroundColor: string; textColor: string };

export interface WorkspaceLogoIconProps {
  workspace: WorkspaceFromAPI;
  className?: string;
  showBackground?: boolean;
}

const defaultBranding: BrandingType = {
  backgroundColor: 'hsl(var(--primary))',
  textColor: 'hsl(var(--primary-foreground))'
};

export const WorkspaceLogoIcon = ({
  workspace,
  className,
  showBackground = true
}: WorkspaceLogoIconProps) => {
  const branding = (workspace.branding as BrandingType) || defaultBranding;

  const bgStyle = showBackground
    ? {
        backgroundColor: branding.backgroundColor,
        color: branding.textColor
      }
    : {};

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-md transition-colors',
        showBackground && 'p-0.5',
        className
      )}
      style={bgStyle}
    >
      <div className="relative z-10 flex size-full items-center justify-center">
        {workspace.imageUrl ? (
          <img
            src={workspace.imageUrl}
            alt={workspace.displayName}
            className="size-full object-cover"
          />
        ) : (
          workspace.displayName.charAt(0).toUpperCase()
        )}
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 100% 100%, 
            ${branding.textColor} 0%, 
            transparent 50%
          )`
        }}
      />
    </div>
  );
};
