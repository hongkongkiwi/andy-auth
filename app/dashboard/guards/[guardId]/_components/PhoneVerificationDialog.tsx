'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import { Guard } from '@/constants/mock-api';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhoneVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guard: Guard;
  onPhoneUpdate: (phone: string) => void;
  onVerifying: (verifying: boolean) => void;
  isVerifying?: boolean;
}

export function PhoneVerificationDialog({
  open,
  onOpenChange,
  guard,
  onPhoneUpdate,
  onVerifying,
  isVerifying: externalVerifying = false
}: PhoneVerificationDialogProps) {
  const [verificationCode, setVerificationCode] = React.useState('');
  const [isSendingCode, setIsSendingCode] = React.useState(false);
  const [internalVerifying, setInternalVerifying] = React.useState(false);
  const [codeSent, setCodeSent] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);
  const [isError, setIsError] = React.useState(false);

  // Add ref for input focus
  const codeInputRef = React.useRef<HTMLInputElement>(null);

  // Add ref for the hidden input
  const hiddenInputRef = React.useRef<HTMLInputElement>(null);

  // Add constant for valid code
  const VALID_CODE = '123456';

  // Add state for error timeout
  const errorTimeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Add effect to focus input when code is sent
  React.useEffect(() => {
    if (codeSent && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [codeSent]);

  // Add effect to reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setCodeSent(false);
      setVerificationCode('');
      setIsError(false);
      setCountdown(0);
    }
  }, [open]);

  // Update error handling to auto-clear after 4s
  const setErrorWithTimeout = () => {
    setIsError(true);
    // Clear any existing timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    // Set new timeout
    errorTimeoutRef.current = setTimeout(() => {
      setIsError(false);
    }, 4000);
  };

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleSendCode = async () => {
    setIsSendingCode(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCodeSent(true);
      setCountdown(30);
      onVerifying(true); // Start verification status when code is sent
      toast.success('Verification code sent');
    } catch (error) {
      toast.error('Failed to send verification code');
    } finally {
      setIsSendingCode(false);
    }
  };

  // Update handleVerifyCode to use internal state
  const handleVerifyCode = async (code: string) => {
    if (!code) return;

    setInternalVerifying(true); // Use internal state for UI
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (code === VALID_CODE) {
        onPhoneUpdate(guard.phone);
        toast.success('Phone number verified');
        onVerifying(false); // Turn off external verification
        onOpenChange(false);
      } else {
        toast.error('Invalid verification code');
        setErrorWithTimeout();
        setVerificationCode('');
      }
    } catch (error) {
      toast.error('Failed to verify code');
      onVerifying(false); // Turn off external verification on final error
    } finally {
      setInternalVerifying(false); // Reset internal state
    }
  };

  // Update the effect to handle focus after resend
  React.useEffect(() => {
    if (codeInputRef.current && codeSent) {
      // Focus when:
      // 1. Verification completes (!isVerifying)
      // 2. Code sending completes (!isSendingCode)
      if (!internalVerifying || !isSendingCode) {
        setTimeout(() => {
          codeInputRef.current?.focus();
        }, 0);
      }
    }
  }, [internalVerifying, isSendingCode, codeSent]);

  // Update the effect to handle focus during verification
  React.useEffect(() => {
    if (internalVerifying && hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    } else if (!internalVerifying && codeInputRef.current && codeSent) {
      codeInputRef.current.focus();
    }
  }, [internalVerifying, codeSent]);

  // Add state to track if we should skip to code screen
  React.useEffect(() => {
    if (open && externalVerifying) {
      setCodeSent(true); // Show code screen
      setVerificationCode(''); // Clear any existing code
    }
  }, [open, externalVerifying]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="select-none sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Phone Number</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
              <Phone className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{guard.phone}</p>
              <p className="text-xs text-muted-foreground">
                {codeSent
                  ? 'Verification in progress'
                  : 'Verification Required'}
              </p>
            </div>
          </div>

          {codeSent ? (
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <div className="space-y-4">
                  <div className="select-none space-y-2">
                    <h4 className="text-sm font-medium">Verification Code</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code sent to your phone number
                    </p>
                  </div>

                  <div className="flex items-stretch gap-3">
                    <div className="w-[130px] flex-shrink-0">
                      <Input
                        ref={codeInputRef}
                        value={
                          verificationCode.slice(0, 3) +
                          (verificationCode.length > 3 ? '-' : '') +
                          verificationCode.slice(3)
                        }
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/[^0-9]/g, '')
                            .slice(0, 6);
                          setVerificationCode(value);
                          if (isError) setIsError(false);

                          // Auto-verify when 6 digits are entered
                          if (value.length === 6) {
                            handleVerifyCode(value);
                          }
                        }}
                        placeholder="000-000"
                        maxLength={7}
                        className={cn(
                          'h-12 px-4 font-mono text-lg tracking-wider transition-colors duration-200',
                          isError && 'border-destructive bg-destructive/10',
                          internalVerifying && 'opacity-50', // Use internal state
                          'focus-visible:ring-1 focus-visible:ring-offset-0',
                          internalVerifying && 'focus-visible:ring-0' // Use internal state
                        )}
                        disabled={internalVerifying} // Use internal state
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        inputMode="numeric"
                        autoFocus
                        name="verification-code"
                        aria-label="verification code"
                        data-1p-ignore
                        data-lpignore="true"
                        data-form-type="other"
                      />
                    </div>
                    <div className="flex-1">
                      <Button
                        variant={countdown > 0 ? 'secondary' : 'outline'}
                        className={cn(
                          'h-12 w-full transition-colors duration-200',
                          countdown > 0 && 'opacity-50',
                          !countdown &&
                            !internalVerifying &&
                            'border-primary/20 bg-primary/10 hover:bg-primary/20',
                          'focus-visible:ring-0 focus-visible:ring-offset-0'
                        )}
                        onClick={() => {
                          if (countdown === 0) {
                            setVerificationCode('');
                            handleSendCode();
                          }
                        }}
                        disabled={countdown > 0 || internalVerifying} // Disable during verification
                      >
                        {countdown > 0 ? (
                          <span className="text-muted-foreground">
                            Resend in {countdown}s
                          </span>
                        ) : isSendingCode ? (
                          <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Resend Code'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className={cn(
                  'h-12 w-full',
                  'focus-visible:ring-0 focus-visible:ring-offset-0'
                )}
                onClick={() => handleVerifyCode(verificationCode)}
                disabled={verificationCode.length !== 6 || internalVerifying} // Use internal state
                size="lg"
              >
                {internalVerifying ? ( // Use internal state
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm text-muted-foreground">
                  We&apos;ll send a verification code to your phone number.
                  Enter the code on the next screen to verify your phone number.
                </p>
              </div>
              <Button
                className="h-12 w-full"
                onClick={handleSendCode}
                disabled={isSendingCode}
                size="lg"
              >
                {isSendingCode ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
