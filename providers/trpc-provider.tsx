'use client';

import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from '@/lib/trpc/client';
import superjson from 'superjson';
import { type ReactNode } from 'react';

const queryClient = new QueryClient();

const trpcClient = api.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson
    })
  ]
});

interface TrpcProviderProps {
  children: ReactNode;
}

export const TrpcProvider = ({ children }: TrpcProviderProps) => (
  <api.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </api.Provider>
);
