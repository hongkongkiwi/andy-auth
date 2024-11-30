'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SessionProvider, SessionProviderProps } from 'next-auth/react';

type ProvidersProps = {
  session: SessionProviderProps['session'];
  children: ReactNode;
};

/**
 * Application-wide providers wrapper component
 */
export const Providers: React.FC<ProvidersProps> = ({ session, children }) => {
  return (
    <ThemeProvider>
      <SessionProvider session={session}>{children}</SessionProvider>
    </ThemeProvider>
  );
};
