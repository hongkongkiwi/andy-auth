import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AUTH_ROUTE_CONFIG } from '@/lib/auth/routes';
import { VerifyEmail } from '../_components';
import { ErrorBoundary } from 'react-error-boundary';
import AuthError from '../_components/ui/auth-error';

export const metadata: Metadata = {
  title: 'Verify Email | Authentication',
  description: 'Verify your email address'
};

const VerifyPage = async () => {
  const session = await auth();

  if (!session) {
    redirect(AUTH_ROUTE_CONFIG.routes.public.login);
  }

  if (session.user.emailVerified) {
    redirect(AUTH_ROUTE_CONFIG.routes.protected.dashboard);
  }

  return (
    <ErrorBoundary FallbackComponent={AuthError}>
      <VerifyEmail email={session.user.email ?? undefined} />
    </ErrorBoundary>
  );
};

export default VerifyPage;
