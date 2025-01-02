'use client';

import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
