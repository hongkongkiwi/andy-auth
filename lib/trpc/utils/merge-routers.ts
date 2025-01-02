import { router } from '../index';
import type { AnyRouter } from '@trpc/server';
import { checkRead, checkMutate } from '@/lib/zenstack/trpc/helper';

export const mergeRouters = <T extends Record<string, AnyRouter>>(
  routerMap: T
) => {
  return router(routerMap);
};

export const withZenStackContext = <T>(promise: Promise<T>) => {
  return {
    query: () => checkRead(promise),
    mutation: () => checkMutate(promise)
  };
};
