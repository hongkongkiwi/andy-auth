'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Pen, ImageOff } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface ProfilePictureProps {
  file?: {
    objectKey: string;
    objectBucket: string;
    mimeType: string;
    sizeInBytes: number;
  } | null;
  displaySize?: number;
  className?: string;
}

export const ProfilePicture = ({
  file,
  displaySize = 40,
  className
}: ProfilePictureProps) => {
  const imageUrl = file
    ? `/api/storage/${file.objectBucket}/${file.objectKey}`
    : `/images/default-avatar.png`;

  return (
    <Avatar className={cn('relative', className)}>
      <AvatarImage
        src={imageUrl}
        alt="Profile picture"
        width={displaySize}
        height={displaySize}
      />
      <AvatarFallback>
        <User className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
};

ProfilePicture.displayName = 'ProfilePicture';
