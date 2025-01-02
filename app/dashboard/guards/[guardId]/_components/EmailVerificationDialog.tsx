'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import { Guard } from '@/constants/mock-api';
import { Mail } from 'lucide-react';

interface EmailVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guard: Guard;
  onEmailUpdate: (email: string) => void;
  lastEmailSent?: number;
  onEmailSent: (timestamp: number) => void;
  isVerifying?: boolean;
}

export function EmailVerificationDialog({
  open,
  onOpenChange,
  guard,
  onEmailUpdate,
  lastEmailSent = 0,
  onEmailSent,
  isVerifying
}: EmailVerificationDialogProps) {
  const [isSending, setIsSending] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);

  React.useEffect(() => {
    if (lastEmailSent === 0 || Date.now() - lastEmailSent >= 30000) {
      setCountdown(0);
      return;
    }

    setCountdown(Math.ceil((30000 - (Date.now() - lastEmailSent)) / 1000));
    const timer = setInterval(() => {
      setCountdown((prev) => {
        const newCount = Math.ceil(
          (30000 - (Date.now() - lastEmailSent)) / 1000
        );
        return newCount > 0 ? newCount : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lastEmailSent]);

  React.useEffect(() => {
    if (open && isVerifying) {
      setEmailSent(true);
    }
  }, [open, isVerifying]);

  const handleSendVerification = async () => {
    setIsSending(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEmailSent(true);
      onEmailSent(Date.now());
      toast.success('Verification email sent');
    } catch (error) {
      toast.error('Failed to send verification email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Email Address</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{guard.email}</p>
              <p className="text-xs text-muted-foreground">
                Verification Required
              </p>
            </div>
          </div>

          {emailSent ? (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 text-sm font-medium">
                  Verification Email Sent
                </h4>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent a verification link to your email address.
                  Please check your email and click the link to verify.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSendVerification}
                  disabled={isSending || countdown > 0}
                >
                  {isSending ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    'Resend Email'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click below to send a verification link to your email address.
              </p>
              <Button
                className="w-full"
                onClick={handleSendVerification}
                disabled={isSending || countdown > 0}
              >
                {isSending ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  'Send Verification Link'
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
