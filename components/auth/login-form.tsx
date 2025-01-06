'use client';

import { useSession, signIn } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/lib/auth/validations/schemas';
import type { LoginFormData } from '@/lib/auth/types';
import { useToast } from '@/components/ui/use-toast';
import { AuthError } from '@/lib/auth/errors';

export const LoginForm = () => {
  const { session, isPending } = useSession();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe
      });
    } catch (error) {
      if (error instanceof AuthError) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive'
        });
      }
    }
  };

  if (isPending) {
    return <div>Loading...</div>; // Or your existing loading component
  }

  if (session) {
    return null; // Or redirect/show dashboard
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Your existing form UI */}
    </form>
  );
};
