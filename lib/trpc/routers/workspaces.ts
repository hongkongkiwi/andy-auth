import { protectedProcedure, router } from '../index';
import { TRPCError } from '@trpc/server';
import type { Workspace, Client } from '@/lib/auth/types';
import { z } from 'zod';
import { withZenStackContext } from '../utils/merge-routers';
import type { PrismaClient } from '@prisma/client';

// Type for workspace response from Prisma
interface WorkspaceWithPermissions {
  id: string;
  displayName: string;
  imageUrl: string | null;
  workspaceStatus: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  deletedBy: string | null;
  lastModifiedBy: string | null;
  slug: string | null;
  companyName: string | null;
  notes: string | null;
  workspacePermissions: Array<{ permissions: string[] }>;
}

// Type for client response from Prisma
interface ClientWithPermissions {
  id: string;
  displayName: string;
  imageUrl: string | null;
  workspaceId: string;
  permissions: Array<{ permissions: string[] }>;
}

export const workspacesRouter = router({
  findMany: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const promise = ctx.prisma.workspace.findMany({
      where: {
        workspacePermissions: {
          some: {
            userId: ctx.session.user.id
          }
        }
      },
      include: {
        workspacePermissions: {
          where: {
            userId: ctx.session.user.id
          },
          select: {
            permissions: true
          }
        }
      }
    });

    const workspaces = (await withZenStackContext(
      promise
    ).query()) as WorkspaceWithPermissions[];

    return workspaces.map((workspace) => ({
      id: workspace.id,
      displayName: workspace.displayName,
      imageUrl: workspace.imageUrl,
      status: workspace.workspaceStatus,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      deletedAt: workspace.deletedAt,
      deletedBy: workspace.deletedBy,
      lastModifiedBy: workspace.lastModifiedBy,
      slug: workspace.slug,
      companyName: workspace.companyName,
      notes: workspace.notes,
      permissions: workspace.workspacePermissions[0]?.permissions ?? []
    })) as Workspace[];
  }),

  getWorkspaceStats: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const promise = ctx.prisma.client.findMany({
        where: {
          workspaceId: input.workspaceId,
          permissions: {
            some: {
              userId: ctx.session.user.id
            }
          }
        },
        include: {
          permissions: {
            where: {
              userId: ctx.session.user.id
            },
            select: {
              permissions: true
            }
          }
        }
      });

      const clients = (await withZenStackContext(
        promise
      ).query()) as ClientWithPermissions[];

      return clients.map((client) => ({
        id: client.id,
        displayName: client.displayName,
        imageUrl: client.imageUrl,
        workspaceId: client.workspaceId,
        permissions: client.permissions[0]?.permissions ?? []
      })) as Client[];
    })
});

// Export both names for compatibility
export const workspaceRouter = workspacesRouter;
