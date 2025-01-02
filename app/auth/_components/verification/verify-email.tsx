'use client';

import * as React from 'react';
import { useAuthError } from '@/lib/auth/hooks/use-auth-error';
import { ErrorBoundary } from 'react-error-boundary';
import AuthError from '../ui/auth-error';
import { Loading } from '../ui/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
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
import { VerificationLayout } from './verification-layout';

const emailSchema = z.object({
  email: z.string().email('Invalid email address')
});

interface VerifyEmailProps {
  email?: string;
  phone?: string;
  className?: string;
  onVerified?: () => void;
}

const VerifyEmail = ({
  email,
  phone,
  className,
  onVerified
}: VerifyEmailProps) => {
  const [isVerifying, setIsVerifying] = React.useState(false);
  const { handleAuthError } = useAuthError();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: email || ''
    }
  });

  const handleEmailVerification = React.useCallback(
    async (data: z.infer<typeof emailSchema>) => {
      try {
        setIsVerifying(true);
        // Your email verification logic here
        toast.success('Verification email sent');
        onVerified?.();
      } catch (error) {
        handleAuthError(error as Error);
      } finally {
        setIsVerifying(false);
      }
    },
    [handleAuthError, onVerified]
  );

  if (isVerifying) return <Loading />;

  return (
    <ErrorBoundary FallbackComponent={AuthError} onError={handleAuthError}>
      <VerificationLayout
        email={email}
        phone={phone}
        className={className}
        onVerified={onVerified}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEmailVerification)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Send Verification Email
            </Button>
          </form>
        </Form>
      </VerificationLayout>
    </ErrorBoundary>
  );
};

export default VerifyEmail;
