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
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import GoogleAuthButton from '../google-auth-button';
import { AUTH_ROUTE_CONFIG } from '@/lib/auth/routes';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { AUTH_ERROR_MESSAGES, type AuthErrorType } from '../types/auth-errors';
import Loading from '../ui/loading';
import { Checkbox } from '@/components/ui/checkbox';
import AuthError from '../ui/auth-error';

const formSchema = z.object({
  email: z.string().email({ message: AUTH_ERROR_MESSAGES.InvalidEmail }),
  password: z.string().min(6, { message: AUTH_ERROR_MESSAGES.InvalidPassword }),
  rememberMe: z.boolean().default(false)
});

type UserFormValue = z.infer<typeof formSchema>;

export interface UserAuthFormProps {
  callbackUrl?: string;
}

const UserAuthForm = ({
  callbackUrl
}: UserAuthFormProps): React.JSX.Element => {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const error = searchParams.get('error') as AuthErrorType | null;
  const [isLoading, setIsLoading] = React.useState(false);
  const isDisabled = isPending || isLoading;

  React.useEffect(() => {
    if (error) {
      toast.error(AUTH_ERROR_MESSAGES[error] || AUTH_ERROR_MESSAGES.Default);
    }
  }, [error]);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      try {
        setIsLoading(true);
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: true,
          callbackUrl:
            callbackUrl ?? AUTH_ROUTE_CONFIG.defaultRedirects.afterLogin
        });

        if (!result?.ok) {
          throw new Error(AUTH_ERROR_MESSAGES.CredentialsSignin);
        }
      } catch (error) {
        console.error('Sign in error:', error);
        toast.error(AUTH_ERROR_MESSAGES.CredentialsSignin);
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={isPending}
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={isPending}
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm">Remember me</FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isDisabled}>
            {isDisabled ? (
              <>
                <Loading className="mr-2 h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleAuthButton callbackUrl={callbackUrl} />
    </>
  );
};

export default UserAuthForm;
