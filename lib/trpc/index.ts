import { initTRPC, TRPCError } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import superjson from 'superjson';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import type { Session } from 'next-auth';
import type { NextRequest } from 'next/server';
import { ZodError } from 'zod';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Enhanced context type with session
interface Context {
  session: Session | null;
  prisma: PrismaClient;
  req?: NextRequest;
}

export const createContext = async ({
  req
}: { req?: NextRequest } = {}): Promise<Context> => {
  const session = await auth();
  return {
    session,
    prisma,
    req
  };
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
      }
    };
  }
});

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user
    }
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
