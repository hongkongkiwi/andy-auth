import { AuthError } from '@/app/auth/_components';
import {
  AUTH_ERROR_MESSAGES,
  type AuthErrorType
} from '../_components/types/auth-errors';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication Error',
  description: 'An error occurred during authentication'
};

interface ErrorPageProps {
  searchParams: {
    error?: AuthErrorType;
    message?: string;
  };
}

const ErrorPage = ({ searchParams }: ErrorPageProps): React.JSX.Element => {
  const error = searchParams.error ?? 'Default';
  const description = searchParams.message ?? AUTH_ERROR_MESSAGES[error];

  return (
    <AuthError
      error={error}
      description={description}
      showBackButton={error !== 'Configuration'}
    />
  );
};

export default ErrorPage;
