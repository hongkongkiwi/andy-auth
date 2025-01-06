import { withNestedPermissions } from '@/lib/auth/middleware/permission-middleware';

export const GET = withNestedPermissions(
  async (req) => {
    // Your handler code here
  },
  {
    workspace: WorkspacePermissionRole.VIEWER
  }
);
