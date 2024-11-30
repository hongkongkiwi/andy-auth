'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { WorkspaceLogo } from '../types';

type WorkspaceLogoIconProps = {
  logo: WorkspaceLogo;
  className?: string;
};

export const WorkspaceLogoIcon = ({ logo, className }: WorkspaceLogoIconProps) => {
  switch (logo.type) {
    case 'image':
      return (
        <Image
          src={logo.imageUrl}
          alt={logo.alt || 'Workspace Logo'}
          width={24}
          height={24}
          className={cn('object-contain', className)}
        />
      );
    case 'icon':
      const Icon = logo.icon;
      return <Icon className={cn('size-4', className)} />;
  }
}; 