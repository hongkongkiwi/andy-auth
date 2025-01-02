import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AUTH_ROUTE_CONFIG } from '@/lib/auth/routes';
import { LoginForm } from '../_components';

export const metadata: Metadata = {
  title: 'Login | Authentication',
  description: 'Login to your account'
};

const LoginPage = async () => {
  const session = await auth();

  if (session) {
    redirect(AUTH_ROUTE_CONFIG.routes.protected.dashboard);
  }

  return <LoginForm />;
};

export default LoginPage;
