import { useZenStackClient } from '@/lib/auth/hooks/useZenStackClient';

export const PostActions = ({ postId }: { postId: string }) => {
  const { getClient } = useZenStackClient();

  const updatePost = async (data: any) => {
    const client = getClient();
    if (!client) return;

    // ZenStack will automatically check permissions
    return client.post.update({
      where: { id: postId },
      data
    });
  };

  // Rest of component...
};
