'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, LogIn } from 'lucide-react';
import { AUTH_ROUTE_CONFIG } from '@/lib/auth/routes';
import { toast } from 'sonner';
import { AUTH_ERROR_MESSAGES, type AuthErrorType } from '../types/auth-errors';
import { cn } from '@/lib/utils';
import type { FallbackProps } from 'react-error-boundary';

interface AuthErrorProps extends Partial<FallbackProps> {
  error?: AuthErrorType;
  description?: string;
  showBackButton?: boolean;
  className?: string;
}

const AuthError = ({
  error = 'Default',
  description = AUTH_ERROR_MESSAGES[error] || AUTH_ERROR_MESSAGES.Default,
  showBackButton = true,
  className,
  resetErrorBoundary
}: AuthErrorProps): React.JSX.Element => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState(false);

  const handleNavigation = React.useCallback(async (action: () => void) => {
    try {
      setIsNavigating(true);
      await action();
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error(AUTH_ERROR_MESSAGES.Default);
    } finally {
      setIsNavigating(false);
    }
  }, []);

  const handleBack = React.useCallback(() => {
    handleNavigation(() => router.back());
  }, [router, handleNavigation]);

  const handleLogin = React.useCallback(() => {
    handleNavigation(() => router.push(AUTH_ROUTE_CONFIG.routes.public.login));
  }, [router, handleNavigation]);

  const handleRetry = React.useCallback(async () => {
    try {
      setIsNavigating(true);
      if (resetErrorBoundary) {
        await resetErrorBoundary();
      } else {
        await handleLogin();
      }
    } catch (error) {
      console.error('Error recovery failed:', error);
      toast.error(AUTH_ERROR_MESSAGES.Default);
    } finally {
      setIsNavigating(false);
    }
  }, [resetErrorBoundary, handleLogin]);

  return (
    <div className={cn('grid min-h-screen place-items-center p-4', className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle
              className="h-5 w-5 text-destructive"
              aria-hidden="true"
            />
            Authentication Error
          </CardTitle>
          <CardDescription className="text-destructive">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Please try again or contact support if the problem persists.
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {showBackButton && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isNavigating}
              className="gap-2"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Go Back</span>
            </Button>
          )}
          <Button
            onClick={handleRetry}
            disabled={isNavigating}
            className="gap-2"
            aria-label="Retry or return to login"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            <span>{resetErrorBoundary ? 'Retry' : 'Return to Login'}</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthError;
