'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { api } from '@/lib/trpc/client';
import superjson from 'superjson';
import { SessionProvider } from 'next-auth/react';
import { WorkspaceProvider } from '@/components/layout/WorkspaceSwitcher';
import { ClientProvider } from '@/components/layout/ClientSwitcher/contexts/ClientContext';

export function Providers({
  children,
  session
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson
        })
      ]
    })
  );

  return (
    <SessionProvider session={session}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <WorkspaceProvider>
            <ClientProvider>{children}</ClientProvider>
          </WorkspaceProvider>
        </QueryClientProvider>
      </api.Provider>
    </SessionProvider>
  );
}
