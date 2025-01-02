'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTE_CONFIG } from '@/lib/auth/routes';
import { useAuthError } from '@/lib/auth/hooks/use-auth-error';
import { toast } from 'sonner';
import { verificationService } from '@/lib/auth/services/verification-service';

type VerificationMethod = 'email' | 'phone';
type VerificationStatus =
  | 'idle'
  | 'sending'
  | 'sent'
  | 'verifying'
  | 'verified'
  | 'error';

interface VerificationState {
  method: VerificationMethod | null;
  status: VerificationStatus;
  error: Error | null;
  attempts: number;
  lastAttempt: Date | null;
}

interface VerificationContextType extends VerificationState {
  setMethod: (method: VerificationMethod) => void;
  startVerification: () => Promise<void>;
  completeVerification: (code: string) => Promise<void>;
  resetVerification: () => void;
  canAttempt: boolean;
  timeUntilNextAttempt: number;
}

const MAX_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT = 60 * 1000; // 1 minute

const VerificationContext = React.createContext<
  VerificationContextType | undefined
>(undefined);

export const useVerification = () => {
  const context = React.useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within VerificationProvider');
  }
  return context;
};

interface VerificationTarget {
  email?: string;
  phone?: string;
}

interface VerificationProviderProps {
  children: React.ReactNode;
  onVerified?: () => void;
  redirectUrl?: string;
  target?: VerificationTarget;
}

export const VerificationProvider = ({
  children,
  onVerified,
  redirectUrl = AUTH_ROUTE_CONFIG.routes.protected.dashboard,
  target
}: VerificationProviderProps) => {
  const router = useRouter();
  const { handleAuthError } = useAuthError();

  const [state, setState] = React.useState<VerificationState>({
    method: null,
    status: 'idle',
    error: null,
    attempts: 0,
    lastAttempt: null
  });

  const canAttempt = React.useMemo(() => {
    if (state.attempts >= MAX_ATTEMPTS) return false;
    if (!state.lastAttempt) return true;
    return Date.now() - state.lastAttempt.getTime() >= ATTEMPT_TIMEOUT;
  }, [state.attempts, state.lastAttempt]);

  const timeUntilNextAttempt = React.useMemo(() => {
    if (!state.lastAttempt) return 0;
    const remaining =
      ATTEMPT_TIMEOUT - (Date.now() - state.lastAttempt.getTime());
    return Math.max(0, Math.ceil(remaining / 1000));
  }, [state.lastAttempt]);

  const setMethod = React.useCallback((method: VerificationMethod) => {
    setState((prev) => ({ ...prev, method, status: 'idle', error: null }));
  }, []);

  const startVerification = React.useCallback(async () => {
    if (!canAttempt) {
      toast.error(
        `Please wait ${timeUntilNextAttempt} seconds before trying again`
      );
      return;
    }

    const targetValue = state.method && target?.[state.method];
    if (!targetValue) {
      toast.error(`No ${state.method} provided for verification`);
      return;
    }

    try {
      setState((prev) => ({
        ...prev,
        status: 'sending',
        attempts: prev.attempts + 1,
        lastAttempt: new Date(),
        error: null
      }));

      await verificationService.sendVerification({
        method: state.method,
        target: targetValue
      });

      setState((prev) => ({ ...prev, status: 'sent' }));
      toast.success(`Verification code sent to your ${state.method}`);
    } catch (error) {
      handleAuthError(error as Error);
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: error as Error
      }));
    }
  }, [canAttempt, timeUntilNextAttempt, handleAuthError, state.method, target]);

  const completeVerification = React.useCallback(
    async (code: string) => {
      if (!state.method || !target?.[state.method]) {
        toast.error(`No ${state.method} provided for verification`);
        return;
      }

      try {
        setState((prev) => ({ ...prev, status: 'verifying' }));

        await verificationService.verifyCode({
          method: state.method,
          target: target[state.method]!,
          code
        });

        setState((prev) => ({ ...prev, status: 'verified' }));
        toast.success('Verification completed successfully');
        onVerified?.();
        router.push(redirectUrl);
      } catch (error) {
        handleAuthError(error as Error);
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: error as Error
        }));
      }
    },
    [state.method, target, handleAuthError, onVerified, redirectUrl, router]
  );

  const resetVerification = React.useCallback(() => {
    setState({
      method: null,
      status: 'idle',
      error: null,
      attempts: 0,
      lastAttempt: null
    });
  }, []);

  const value = React.useMemo(
    () => ({
      ...state,
      setMethod,
      startVerification,
      completeVerification,
      resetVerification,
      canAttempt,
      timeUntilNextAttempt
    }),
    [
      state,
      setMethod,
      startVerification,
      completeVerification,
      resetVerification,
      canAttempt,
      timeUntilNextAttempt
    ]
  );

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
};
