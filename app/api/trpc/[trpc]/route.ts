import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc/routers';
import { createContext } from '@/lib/trpc';
import type { NextRequest } from 'next/server';

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () =>
      createContext({
        req,
        res: new Response(),
        info: {
          type: 'unknown',
          isBatchCall: false,
          calls: [],
          accept: 'application/json',
          connectionParams: {},
          signal: new AbortController().signal
        }
      })
  });

export { handler as GET, handler as POST };
