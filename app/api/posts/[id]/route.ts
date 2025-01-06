import { createProtectedHandler } from '@/lib/auth/middleware/unified-permission-middleware';
import { createWorkspaceModelPermission } from '@/lib/auth/utils/permission-utils';

export const GET = createProtectedHandler(
  createWorkspaceModelPermission('workspace_id', 'Post', 'read'),
  async (req) => {
    const { zenstackDb } = req;
    const id = req.nextUrl.pathname.split('/').pop();

    // ZenStack will automatically apply access policies
    const post = await zenstackDb.post.findUnique({
      where: { id }
    });

    return Response.json(post);
  }
);
