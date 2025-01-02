'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ClientAvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const ClientAvatar = ({
  src,
  alt,
  size = 'sm',
  className
}: ClientAvatarProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8'
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>
        <Building2 className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
};
