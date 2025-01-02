import { router } from '@/lib/trpc/trpc';
import { workspaceRouter } from './workspaces';
import { clientRouter } from './clients';
import { createRouter as createZenStackRouter } from '@/lib/zenstack/trpc/routers';

const zenStackRouter = createZenStackRouter();

export const appRouter = router({
  // Custom routes with unique namespaces
  t_workspace: workspaceRouter,
  t_client: clientRouter,
  // Generated routes
  Workspace: zenStackRouter.Workspace,
  Client: zenStackRouter.Client
});

export type AppRouter = typeof appRouter;
