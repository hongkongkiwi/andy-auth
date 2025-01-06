import { withClientAccess } from '@/lib/auth/middleware/permission-middleware';
import { getWorkspaceInclude } from '@/lib/auth/utils/workspace-visibility';
import { prisma } from '@/lib/db';
import { NextResponse, type NextRequest } from 'next/server';
import { ClientPermissionRole } from '@prisma/client';
import type { WorkspaceVisibility } from '@/types/workspace';

export const GET = withClientAccess(
  async (req: NextRequest) => {
    const workspaceVisibility = req.headers.get(
      'x-workspace-visibility'
    ) as WorkspaceVisibility;
    const clientId = req.headers.get('x-client-id');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID required' },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        workspace: getWorkspaceInclude(workspaceVisibility),
        _count: {
          select: { locations: true }
        }
      }
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ data: client });
  },
  ClientPermissionRole.VIEWER,
  { workspaceVisibility: true }
);
