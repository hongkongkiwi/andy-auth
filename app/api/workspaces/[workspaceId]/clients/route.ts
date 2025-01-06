import { withNestedPermissions } from '@/lib/auth/middleware/permission-middleware';
import { WorkspacePermissionRole } from '@prisma/client';
import { prisma } from '@/lib/db';
import { NextResponse, type NextRequest } from 'next/server';

export const GET = withNestedPermissions(
  async (req: NextRequest) => {
    const workspaceId = req.headers.get('x-workspace-id');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Workspace ID required' },
        { status: 400 }
      );
    }

    const clients = await prisma.client.findMany({
      where: { workspaceId: workspaceId },
      include: {
        _count: {
          select: { locations: true }
        }
      }
    });

    return NextResponse.json({ clients });
  },
  {
    workspace: WorkspacePermissionRole.CLIENT_USER
  }
);
