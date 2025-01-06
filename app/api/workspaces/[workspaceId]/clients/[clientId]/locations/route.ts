import { withNestedPermissions } from '@/lib/auth/middleware/permission-middleware';
import { WorkspacePermissionRole, ClientPermissionRole } from '@prisma/client';

export const GET = withNestedPermissions(
  async (req) => {
    const clientId = req.headers.get('x-client-id');
    // Your handler code
  },
  {
    workspace: WorkspacePermissionRole.VIEWER,
    client: ClientPermissionRole.ADMIN
  }
);
