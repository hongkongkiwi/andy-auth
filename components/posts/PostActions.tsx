import { useUnifiedPermissions } from '@/lib/auth/hooks/useUnifiedPermissions';
import { createWorkspaceModelPermission } from '@/lib/auth/utils/permission-utils';

export const PostActions = ({
  workspaceId,
  postId
}: {
  workspaceId: string;
  postId: string;
}) => {
  const { checkUnifiedPermission } = useUnifiedPermissions();

  const canEditPost = async () => {
    return checkUnifiedPermission(
      createWorkspaceModelPermission(workspaceId, 'Post', 'update')
    );
  };

  // Rest of component...
};
