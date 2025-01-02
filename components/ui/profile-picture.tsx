'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Pen, ImageOff } from 'lucide-react';

interface ProfilePictureProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onEdit?: () => void;
}

const sizeClasses = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-16 w-16 text-xl',
  lg: 'h-24 w-24 text-2xl'
};

export const ProfilePicture = React.forwardRef<
  HTMLDivElement,
  ProfilePictureProps
>(
  (
    {
      imageUrl,
      name,
      size = 'md',
      editable = false,
      onEdit,
      className,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);
    const initials = name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const handleImageError = () => {
      setImageError(true);
    };

    const showInitials = !imageUrl || imageError;

    return (
      <div ref={ref} className={cn('group relative', className)} {...props}>
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full font-semibold',
            showInitials ? 'bg-primary text-primary-foreground' : 'bg-muted',
            editable &&
              'cursor-pointer transition-opacity group-hover:opacity-80',
            sizeClasses[size]
          )}
          onClick={editable ? onEdit : undefined}
        >
          {showInitials ? (
            <span>{initials}</span>
          ) : (
            <img
              src={imageUrl!}
              alt={name}
              className="h-full w-full rounded-full object-cover"
              onError={handleImageError}
            />
          )}
          {imageError && (
            <div className="absolute bottom-0 right-0 rounded-full bg-destructive p-1">
              <ImageOff className="h-3 w-3 text-destructive-foreground" />
            </div>
          )}
        </div>
        {editable && (
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              'pointer-events-none absolute -right-1 -top-1 rounded-full opacity-0 transition-opacity group-hover:opacity-100',
              'h-6 w-6 shadow-sm'
            )}
          >
            <Pen className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }
);

ProfilePicture.displayName = 'ProfilePicture';
