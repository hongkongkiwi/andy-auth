import { protectedProcedure, router } from '../../index';
import { z } from 'zod';
import { withZenStackContext } from '../../utils/merge-routers';

export const customWorkspacesRouter = router({
  getWorkspaceStats: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const promise = ctx.prisma.workspace.findUnique({
        where: { id: input.workspaceId },
        select: {
          _count: {
            select: {
              clients: true,
              members: true,
              projects: true
            }
          }
        }
      });

      return withZenStackContext(promise).query();
    })
});
