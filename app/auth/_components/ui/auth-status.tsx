'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut
} from '@/components/ui/dropdown-menu';
import { User, Settings, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import SignOutButton from '../sign-out-button';

interface AuthStatusProps {
  className?: string;
  showVerification?: boolean;
}

const AuthStatus = ({
  className,
  showVerification = true
}: AuthStatusProps): React.JSX.Element | null => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Button
        variant="ghost"
        disabled
        className={cn('h-8 w-8 p-0', className)}
        aria-label="Loading authentication status"
      >
        <User className="h-4 w-4 animate-pulse" aria-hidden="true" />
      </Button>
    );
  }

  if (!session?.user) {
    return null;
  }

  const initials = session.user.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : (session.user.email?.[0].toUpperCase() ?? '?');

  const isVerified = session.user.emailVerified;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn('relative h-8 w-8 rounded-full', className)}
          aria-label="Open user menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session.user.image ?? undefined}
              alt={session.user.name ?? 'User avatar'}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="flex items-center gap-1 text-sm font-medium leading-none">
              {session.user.name}
              {showVerification && isVerified && (
                <Shield
                  className="h-3 w-3 text-green-500"
                  aria-label="Email verified"
                />
              )}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/settings/profile"
              className="cursor-pointer"
              aria-label="Profile settings"
            >
              <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          {showVerification && !isVerified && (
            <DropdownMenuItem asChild>
              <Link
                href="/auth/verify"
                className="cursor-pointer text-yellow-500 hover:text-yellow-600"
                aria-label="Verify email address"
              >
                <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Verify Email</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton
            variant="ghost"
            className="w-full cursor-pointer justify-start"
            showIcon
          >
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthStatus;
