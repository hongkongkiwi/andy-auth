import { Role, Permission, EntityStatus } from '@prisma/client';

export interface SeedOptions {
  seedUserId?: string;
  count?: number;
  workspaceCount?: number;
  clientsPerWorkspace?: number;
  patrolsPerClient?: number;
  usersPerWorkspace?: number;
  incidentsPerPatrol?: number;
  seed?: number;
  verbose?: boolean;
  validateData?: boolean;
  constraints?: {
    minClientsPerWorkspace?: number;
    maxClientsPerWorkspace?: number;
    minPatrolsPerClient?: number;
    maxPatrolsPerClient?: number;
  };
  permissionsPerUser?: number;
  defaultRole?: Role;
  defaultPermissions?: Permission[];
}

export const DEFAULT_COUNTS = {
  workspaceCount: 5,
  clientsPerWorkspace: 3,
  patrolsPerClient: 2,
  usersPerWorkspace: 3,
  incidentsPerPatrol: 2,
  DEFAULT_SEED: 123,
  permissionsPerUser: 3
} as const;

export interface SeedCounts {
  workspaces: number;
  clients: number;
  patrols: number;
  users: number;
  incidents: number;
  verificationTokens: number;
  authSessions: number;
  oauthAccounts: number;
  objectStorageFiles: number;
  resourceMembers: number;
}

// In the seeding functions, we should track and return these counts
