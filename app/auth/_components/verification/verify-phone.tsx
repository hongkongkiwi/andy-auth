'use client';

import * as React from 'react';
import { useAuthError } from '@/lib/auth/hooks/use-auth-error';
import { ErrorBoundary } from 'react-error-boundary';
import AuthError from '../ui/auth-error';
import { Loading } from '../ui/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Phone } from 'lucide-react';
import { useVerification } from '../contexts/verification-context';

const phoneSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  code: z.string().length(6, 'Code must be 6 digits').optional()
});

interface VerifyPhoneProps {
  phone?: string;
  className?: string;
}

export const VerifyPhone = ({ phone, className }: VerifyPhoneProps) => {
  const [showCode, setShowCode] = React.useState(false);
  const { handleAuthError } = useAuthError();
  const {
    status,
    startVerification,
    completeVerification,
    canAttempt,
    timeUntilNextAttempt
  } = useVerification();

  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: phone || '',
      code: ''
    }
  });

  const handleVerification = React.useCallback(
    async (data: z.infer<typeof phoneSchema>) => {
      try {
        if (!showCode) {
          await startVerification();
          setShowCode(true);
          form.setValue('phoneNumber', data.phoneNumber);
        } else if (data.code) {
          await completeVerification(data.code);
        }
      } catch (error) {
        handleAuthError(error as Error);
      }
    },
    [showCode, startVerification, completeVerification, handleAuthError, form]
  );

  const handleResend = React.useCallback(async () => {
    if (!canAttempt) return;
    try {
      await startVerification();
    } catch (error) {
      handleAuthError(error as Error);
    }
  }, [canAttempt, startVerification, handleAuthError]);

  if (status === 'verifying' || status === 'sending') {
    return <Loading />;
  }

  return (
    <ErrorBoundary FallbackComponent={AuthError}>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Verify Phone Number
          </CardTitle>
          <CardDescription>
            {showCode
              ? 'Enter the verification code sent to your phone'
              : 'Enter your phone number to receive a verification code'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleVerification)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+1234567890"
                        disabled={showCode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showCode && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResend}
                    disabled={!canAttempt}
                  >
                    {timeUntilNextAttempt > 0
                      ? `Resend in ${timeUntilNextAttempt}s`
                      : 'Resend Code'}
                  </Button>
                </div>
              )}
              <Button type="submit" className="w-full">
                {showCode ? 'Verify Code' : 'Send Code'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};
