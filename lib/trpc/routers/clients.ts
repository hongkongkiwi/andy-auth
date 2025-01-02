import { z } from 'zod';
import { protectedProcedure, router } from '../index';

export const clientsRouter = router({
  findMany: protectedProcedure
    .input(
      z.object({
        where: z.object({ workspaceId: z.string() }).optional(),
        orderBy: z.object({ createdAt: z.enum(['asc', 'desc']) }).optional()
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.client.findMany({
        where: {
          workspaceId: input.where?.workspaceId
        },
        orderBy: input.orderBy,
        select: {
          id: true,
          displayName: true,
          imageUrl: true,
          workspaceId: true,
          workspace: {
            select: {
              id: true,
              displayName: true
            }
          }
        }
      });
    }),

  getClientStats: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.client.findUnique({
        where: { id: input.clientId },
        select: {
          _count: {
            select: {
              projects: true,
              contacts: true
            }
          }
        }
      });
    })
});

// Export both names for compatibility
export const clientRouter = clientsRouter;
