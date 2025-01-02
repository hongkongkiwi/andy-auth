import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from './routers';

// Create a properly typed API client
export const api = createTRPCReact<AppRouter>();

// Use ZenStack's generated routes
export const useWorkspaces = () => {
  const query = api.Workspace.findMany;
  return query.useQuery(
    {
      orderBy: { createdAt: 'desc' }
    },
    {
      staleTime: 1000 * 60 * 5
    }
  );
};

// Use custom routes only when needed
export const useWorkspaceStats = (workspaceId: string) => {
  const query = api.t_workspace.getWorkspaceStats;
  return query.useQuery({ workspaceId }, { enabled: !!workspaceId });
};

// Mix of ZenStack and custom routes as needed
export const useWorkspaceClients = (workspaceId: string) => {
  const query = api.Client.findMany;
  return query.useQuery(
    {
      where: { workspaceId },
      orderBy: { createdAt: 'desc' }
    },
    { enabled: !!workspaceId }
  );
};

export const useClientStats = (clientId: string) => {
  const query = api.t_client.getClientStats;
  return query.useQuery({ clientId }, { enabled: !!clientId });
};
