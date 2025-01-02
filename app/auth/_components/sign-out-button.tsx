'use client';

import * as React from 'react';
import { signOut } from 'next-auth/react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useAuthError } from '@/lib/auth/hooks/use-auth-error';
import { useWorkspacePersistence } from '@/lib/auth/hooks/use-workspace-persistence';
import { AUTH_ROUTE_CONFIG } from '@/lib/auth/routes';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignOutButtonProps extends ButtonProps {
  showIcon?: boolean;
  children?: React.ReactNode;
}

const SignOutButton = ({
  className,
  showIcon,
  children,
  ...props
}: SignOutButtonProps) => {
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const { handleAuthError } = useAuthError();
  const { clearPersistedWorkspace } = useWorkspacePersistence();

  const handleSignOut = React.useCallback(async () => {
    try {
      setIsSigningOut(true);
      await clearPersistedWorkspace();
      await signOut({
        callbackUrl: AUTH_ROUTE_CONFIG.routes.public.login
      });
    } catch (error) {
      handleAuthError(error as Error);
    } finally {
      setIsSigningOut(false);
    }
  }, [clearPersistedWorkspace, handleAuthError]);

  return (
    <Button
      variant="ghost"
      className={cn(showIcon && 'gap-2', className)}
      onClick={handleSignOut}
      disabled={isSigningOut}
      aria-label="Sign out of your account"
      {...props}
    >
      {showIcon && <LogOut className="h-4 w-4" aria-hidden="true" />}
      <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
      {children}
    </Button>
  );
};

export default SignOutButton;
