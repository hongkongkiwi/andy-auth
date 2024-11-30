'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ClientAvatarProps } from '../types';

export const ClientAvatar = ({ src, alt, size = 'sm', className }: ClientAvatarProps): JSX.Element => {
  const [imageError, setImageError] = useState(false);
  const dimensions = size === 'sm' ? 20 : 32;
  
  // Always render the fallback initially
  const fallbackElement = (
    <div className={cn(
      'rounded-full flex items-center justify-center bg-muted',
      size === 'sm' ? 'h-5 w-5 text-xs' : 'h-8 w-8 text-sm',
      className
    )}>
      {alt?.charAt(0).toUpperCase() || '?'}
    </div>
  );

  // If no src provided, always show fallback
  if (!src) {
    return fallbackElement;
  }

  return (
    <div className={cn(
      'rounded-full overflow-hidden',
      size === 'sm' ? 'h-5 w-5' : 'h-8 w-8',
      className
    )}>
      {imageError ? (
        fallbackElement
      ) : (
        <Image
          src={src}
          alt={alt}
          width={dimensions}
          height={dimensions}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}; 