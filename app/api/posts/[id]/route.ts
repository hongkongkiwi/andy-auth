import { withZenStack } from '@/lib/auth/middleware/zenstack-middleware';

export const GET = withZenStack(async (req) => {
  const { zenstackDb } = req;
  const id = req.nextUrl.pathname.split('/').pop();

  // ZenStack will automatically apply access policies
  const post = await zenstackDb.post.findUnique({
    where: { id }
  });

  return Response.json(post);
});
