export class SeedError extends Error {
  step: string;
  context: Record<string, unknown>;

  constructor(
    message: string,
    options: {
      cause?: Error;
      step: string;
      context?: Record<string, unknown>;
    }
  ) {
    super(message, { cause: options.cause });
    this.name = 'SeedError';
    this.step = options.step;
    this.context = options.context ?? {};
  }
}

export interface SeedOptions {
  count?: number;
  workspaceCount?: number;
  clientsPerWorkspace?: number;
  locationsPerClient?: number;
  devicesPerClient?: number;
  usersPerWorkspace?: number;
  incidentsPerClient?: number;
  seed?: number;
  verbose?: boolean;
  validateData?: boolean;
  constraints?: {
    minClientsPerWorkspace?: number;
    maxClientsPerWorkspace?: number;
    minLocationsPerClient?: number;
    maxLocationsPerClient?: number;
  };
  permissionsPerUser?: number;
  defaultPermissionRole?: string;
  seedUserId?: string;
}

export const DEFAULT_COUNTS = {
  workspaceCount: 5,
  clientsPerWorkspace: 3,
  locationsPerClient: 2,
  usersPerWorkspace: 3,
  incidentsPerClient: 2,
  DEFAULT_SEED: 123,
  permissionsPerUser: 3
} as const;

export interface WorkspaceSeedOptions extends SeedOptions {}

export interface SeedCounts {
  workspaces: number;
  clients: number;
  locations: number;
  platformUsers: number;
  incidents: number;
  verificationTokens: number;
  authSessions: number;
  oauthAccounts: number;
  storageFiles: number;
  workspacePermissions: number;
  clientPermissions: number;
  locationPermissions: number;
}

// In the seeding functions, we should track and return these counts
