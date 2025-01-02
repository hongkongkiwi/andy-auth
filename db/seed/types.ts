import type {
  Workspace,
  Client,
  PlatformUser,
  GuardProfile,
  Device,
  ClientLocation,
  WorkspaceStatus,
  DeviceType,
  DeviceStatus,
  PlatformUserStatus,
  AccountType,
  WorkspacePermissionType,
  ClientPermissionType,
  ClientLocationPermissionType
} from '@prisma/client';

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
}

export const DEFAULT_COUNTS = {
  workspaceCount: 5,
  clientsPerWorkspace: 3,
  locationsPerClient: 2,
  devicesPerClient: 2,
  usersPerWorkspace: 3,
  incidentsPerClient: 2,
  checkpointsPerLocation: 5,
  patrolsPerRoute: 3,
  DEFAULT_SEED: 123
} as const;

export interface WorkspaceSeedOptions extends SeedOptions {}
export interface ClientSeedOptions extends SeedOptions {}
export interface GuardSeedOptions extends SeedOptions {}
export interface DeviceSeedOptions extends SeedOptions {}
export interface UserSeedOptions extends SeedOptions {}
export interface IncidentSeedOptions extends SeedOptions {}

export interface GeneratedAddress {
  placeId: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  streetNumber: string;
  route: string;
  locality: string;
  administrativeAreaLevel1: string;
  country: string;
  postalCode: string;
}

export interface GeneratedContact {
  name: string;
  emailAddress: string;
  phoneNumber: string;
  relationship?: string;
}

export class SeedError extends Error {
  constructor(
    message: string,
    public context?: any
  ) {
    super(message);
    this.name = 'SeedError';
  }
}

export interface SeedIncidentsParams {
  workspaces: Workspace[];
  clients: Client[];
  platformUsers: PlatformUser[];
  devices: Device[];
}

export interface SeedPatrolsParams {
  workspaces: Workspace[];
  platformUsers: GuardProfile[];
  devices: Device[];
  locations: ClientLocation[];
}

export interface SeedDevicesParams {
  workspaces: Workspace[];
  clients: Client[];
  options?: SeedOptions;
}
