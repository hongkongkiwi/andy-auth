import { router } from '../index';
import { clientsRouter } from './clients';
import { workspacesRouter } from './workspaces';

export const appRouter = router({
  clients: clientsRouter,
  workspaces: workspacesRouter
});

export type AppRouter = typeof appRouter;
