'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AUTH_ROUTE_CONFIG } from '@/lib/auth/routes';
import { signIn } from '@/lib/auth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AUTH_ERROR_MESSAGES, type AuthErrorType } from './types/auth-errors';

interface GoogleAuthButtonProps {
  className?: string;
  callbackUrl?: string;
  onError?: (error: string) => void;
}

const GoogleAuthButton = ({
  className,
  callbackUrl,
  onError
}: GoogleAuthButtonProps): React.JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error') as AuthErrorType | null;
  const [isLoading, setIsLoading] = React.useState(false);
  const MAX_RETRIES = 3;
  const [retryCount, setRetryCount] = React.useState(0);

  React.useEffect(() => {
    if (error && AUTH_ERROR_MESSAGES[error]) {
      const errorMessage = AUTH_ERROR_MESSAGES[error];
      toast.error(errorMessage);
      onError?.(errorMessage);
    }
  }, [error, onError]);

  const handleSignIn = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await signIn('google', {
        callbackUrl,
        redirect: true
      });

      if (!result?.ok && retryCount < MAX_RETRIES) {
        setRetryCount((prev) => prev + 1);
        toast.error(
          `Sign in failed. Retrying... (${retryCount + 1}/${MAX_RETRIES})`
        );
        handleSignIn();
        return;
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      onError?.(AUTH_ERROR_MESSAGES.OAuthSignin);
    } finally {
      setIsLoading(false);
    }
  }, [callbackUrl, onError, retryCount]);

  return (
    <Button
      className={cn('w-full', className)}
      variant="outline"
      type="button"
      onClick={handleSignIn}
      disabled={isLoading}
      aria-label="Sign in with Google"
    >
      {isLoading ? (
        <>
          <Chrome className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          <span>Connecting to Google...</span>
        </>
      ) : (
        <>
          <Chrome className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Continue with Google</span>
        </>
      )}
    </Button>
  );
};

export default GoogleAuthButton;
