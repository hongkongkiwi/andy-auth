import { protectedProcedure, router } from '../../index';
import { z } from 'zod';
import { withZenStackContext } from '../../utils/merge-routers';

export const customClientsRouter = router({
  getClientStats: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const promise = ctx.prisma.client.findUnique({
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

      return withZenStackContext(promise).query();
    })
});
