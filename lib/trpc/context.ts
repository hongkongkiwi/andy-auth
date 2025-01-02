import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { type Session } from 'next-auth';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface CreateContextOptions {
  session: Session | null;
}

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await auth();
  return await createContextInner({ session });
};

export type Context = Awaited<ReturnType<typeof createContext>>;
