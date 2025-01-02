'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import AuthError from '../ui/auth-error';
import { AUTH_ERROR_MESSAGES } from '../types/auth-errors';

const formSchema = z.object({
  email: z.string().email({ message: AUTH_ERROR_MESSAGES.InvalidEmail })
});

const ResetPasswordForm = (): React.JSX.Element => {
  const [isLoading, setIsLoading] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error();
      toast.success('Password reset email sent');
    } catch {
      toast.error(AUTH_ERROR_MESSAGES.Default);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          Reset Password
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
