import { type Session } from 'next-auth';

// 1. Basic utility functions
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 2. Base type definitions
export type Workspace = {
  id: string;
  slug: string;
  displayName: string;
  description?: string;
  logoImageUrl?: string;
  logoDarkImageUrl?: string;
  bannerImageUrl?: string;
  faviconUrl?: string;
  logoSmallImageUrl?: string;
  ogImageUrl?: string;
  contactPhone?: string;
  // Address fields
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  formatted?: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type Client = {
  id: string;
  workspace: Workspace;
  name: string;
  contactPhone?: string;
  imageUrl?: string;
  // Address fields
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  formatted?: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type ClientLocation = {
  id: string;
  workspace: Workspace;
  client: Client;
  name: string;
  contactPhone?: string;
  email?: string;
  website?: string;
  imageUrl?: string;
  // Address fields
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  formatted?: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type Device = {
  id: string;
  workspace: Workspace;
  client: Client;
  location: ClientLocation;
  thingName: string;
  serialNumber: string;
  model: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastCheckIn: Date;
};

// 3. Permission-related types
export type WorkspaceUserStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type WorkspacePermissionType = 
  | 'READ_WORKSPACE'
  | 'UPDATE_WORKSPACE'
  | 'DELETE_WORKSPACE'
  | 'CREATE_WORKSPACE'
  | 'MANAGE_WORKSPACE_USERS'
  | 'MANAGE_WORKSPACE_PERMISSIONS'
  | 'READ_WORKSPACE_LOGS'
  | 'MANAGE_WORKSPACE_BILLING';

export type ClientPermissionType = 
  | 'READ_CLIENT'
  | 'UPDATE_CLIENT'
  | 'DELETE_CLIENT'
  | 'CREATE_CLIENT'
  | 'MANAGE_CLIENT_USERS';

export type ClientLocationPermissionType = 
  | 'READ_LOCATION'
  | 'UPDATE_LOCATION'
  | 'DELETE_LOCATION'
  | 'CREATE_LOCATION'
  | 'MANAGE_LOCATION_DEVICES'
  | 'READ_LOCATION_EVENTS';

// 4. Permission record types
export type WorkspacePermission = {
  id: string;
  user: User;
  userStatus: WorkspaceUserStatus;
  workspace: Workspace;
  permissions: WorkspacePermissionType[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type ClientPermission = {
  id: string;
  user: User;
  client: Client;
  permissions: ClientPermissionType[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type ClientLocationPermission = {
  id: string;
  user: User;
  clientLocation: ClientLocation;
  permissions: ClientLocationPermissionType[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

// 5. User type (depends on permissions)
export type User = {
  id: string;
  workspaces: Workspace[];
  clients: Client[];
  clientLocations: ClientLocation[];
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  imageUrl?: string;
  image?: File;
  createdAt: Date;
  lastLogin?: Date;
  permissions: {
    workspace: WorkspacePermission[];
    client: ClientPermission[];
    clientLocation: ClientLocationPermission[];
  }
};

// 6. Permission mappings
export const clientRolePermissions: Record<User['role'], ClientPermissionType[]> = {
  admin: [
    'READ_CLIENT',
    'UPDATE_CLIENT',
    'DELETE_CLIENT',
    'CREATE_CLIENT',
    'MANAGE_CLIENT_USERS'
  ],
  user: [
    'READ_CLIENT',
    'UPDATE_CLIENT'
  ],
  viewer: [
    'READ_CLIENT'
  ]
};

export const locationRolePermissions: Record<User['role'], ClientLocationPermissionType[]> = {
  admin: [
    'READ_LOCATION',
    'UPDATE_LOCATION',
    'DELETE_LOCATION',
    'CREATE_LOCATION',
    'MANAGE_LOCATION_DEVICES',
    'READ_LOCATION_EVENTS'
  ],
  user: [
    'READ_LOCATION',
    'UPDATE_LOCATION',
    'MANAGE_LOCATION_DEVICES',
    'READ_LOCATION_EVENTS'
  ],
  viewer: [
    'READ_LOCATION',
    'READ_LOCATION_EVENTS'
  ]
};

// 7. Mock data stores (in dependency order)
export const fakeWorkspaces = {
  records: [
    {
      id: "1",
      slug: "security-corp-a",
      displayName: "Security Corp A",
      description: "Main security company workspace",
      logoImageUrl: "",
      contactPhone: "1234567890",
      addressLine1: "123 Security St",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postalCode: "94105",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      slug: "security-corp-b",
      displayName: "Security Corp B",
      description: "Secondary security company workspace",
      logoImageUrl: "",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ] as Workspace[],

  async getWorkspaces() {
    await delay(1000);
    return {
      workspaces: this.records
    };
  }
};

export const fakeClients = {
  records: [
    {
      id: "1",
      workspace: fakeWorkspaces.records[0],
      name: "Tech Solutions Inc",
      contactPhone: "1234567890",
      imageUrl: "",
      addressLine1: "123 Tech Street",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postalCode: "94105",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      workspace: fakeWorkspaces.records[0],
      name: "Global Manufacturing",
      contactPhone: "123-456-7891",
      addressLine1: "456 Industry Ave",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      imageUrl: "",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "3",
      workspace: fakeWorkspaces.records[1],
      name: "Retail Chain Corp",
      contactPhone: "123-456-7892",
      addressLine1: "789 Retail Blvd",
      city: "New York",
      state: "NY",
      country: "USA",
      imageUrl: "",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ] as Client[],

  async getClients(workspaceId: string) {
    await delay(1000);
    return {
      clients: this.records.filter(client => client.workspace.id === workspaceId)
    };
  }
};

export const fakeClientLocations = {
  records: [
    {
      id: "1",
      workspace: fakeWorkspaces.records[0],
      client: fakeClients.records[0],
      name: "Tech Solutions HQ",
      contactPhone: "1234567890",
      email: "hq@techsolutions.com",
      addressLine1: "123 Tech Street",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postalCode: "94105",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      workspace: fakeWorkspaces.records[0],
      client: fakeClients.records[0],
      name: "Tech Solutions R&D",
      addressLine1: "124 Tech Street",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postalCode: "94105",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "3",
      workspace: fakeWorkspaces.records[0],
      client: fakeClients.records[1],
      name: "Global Manufacturing Plant",
      addressLine1: "456 Industry Ave",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      postalCode: "90001",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "4",
      workspace: fakeWorkspaces.records[1],
      client: fakeClients.records[2],
      name: "Retail Chain Store #1",
      addressLine1: "789 Retail Blvd",
      city: "New York",
      state: "NY",
      country: "USA",
      postalCode: "10001",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ] as ClientLocation[],

  async getLocations(clientId: string) {
    await delay(1000);
    return {
      locations: this.records.filter(location => location.client.id === clientId)
    };
  }
};

export const fakeDevices = {
  records: [
    {
      id: "1",
      workspace: fakeWorkspaces.records[0],
      client: fakeClients.records[0],
      location: fakeClientLocations.records[0],
      thingName: "DEV-00001",
      serialNumber: "DEV-00001",
      model: "Model X",
      status: "active",
      lastCheckIn: new Date("2024-03-18T00:00:00Z")
    },
    {
      id: "2",
      workspace: fakeWorkspaces.records[0],
      client: fakeClients.records[0],
      location: fakeClientLocations.records[1],
      thingName: "DEV-00002",
      serialNumber: "DEV-00002",
      model: "Model X",
      status: "active",
      lastCheckIn: new Date("2024-03-18T00:00:00Z")
    },
    {
      id: "3",
      workspace: fakeWorkspaces.records[0],
      client: fakeClients.records[1],
      location: fakeClientLocations.records[2],
      thingName: "DEV-00003",
      serialNumber: "DEV-00003",
      model: "Model Y",
      status: "active",
      lastCheckIn: new Date("2024-03-18T00:00:00Z")
    },
    {
      id: "4",
      workspace: fakeWorkspaces.records[0],
      client: fakeClients.records[1],
      location: fakeClientLocations.records[3],
      thingName: "DEV-00004",
      serialNumber: "DEV-00004",
      model: "Model Y",
      status: "maintenance",
      lastCheckIn: new Date("2024-03-18T00:00:00Z")
    },
    {
      id: "5",
      workspace: fakeWorkspaces.records[1],
      client: fakeClients.records[2],
      location: fakeClientLocations.records[4],
      thingName: "DEV-00005",
      serialNumber: "DEV-00005",
      model: "Model Z",
      status: "active",
      lastCheckIn: new Date("2024-03-18T00:00:00Z")
    }
  ] as Device[],

  async getDevices(locationId: string) {
    await delay(1000);
    return {
      devices: this.records.filter(device => device.location.id === locationId)
    };
  }
};

export const fakeWorkspacePermissions = {
  records: [
    {
      id: "1",
      userStatus: "APPROVED",
      workspace: fakeWorkspaces.records[0],
      permissions: [
        'READ_WORKSPACE',
        'UPDATE_WORKSPACE',
        'DELETE_WORKSPACE',
        'CREATE_WORKSPACE',
        'MANAGE_WORKSPACE_USERS',
        'MANAGE_WORKSPACE_PERMISSIONS',
        'READ_WORKSPACE_LOGS',
        'MANAGE_WORKSPACE_BILLING'
      ],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      userStatus: "APPROVED",
      workspace: fakeWorkspaces.records[0],
      permissions: ['READ_WORKSPACE', 'READ_WORKSPACE_LOGS'],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ] as WorkspacePermission[],

  async getWorkspacePermissions(workspaceId: string) {
    await delay(1000);
    return {
      permissions: this.records.filter(permission => permission.workspace.id === workspaceId)
    };
  }
};

export const fakeClientPermissions = {
  records: [
    {
      id: "1",
      client: fakeClients.records[0],
      permissions: [
        'READ_CLIENT',
        'UPDATE_CLIENT',
        'DELETE_CLIENT',
        'CREATE_CLIENT',
        'MANAGE_CLIENT_USERS'
      ],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      client: fakeClients.records[0],
      permissions: ['READ_CLIENT'],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ] as ClientPermission[],

  async getClientPermissions(clientId: string) {
    await delay(1000);
    return {
      permissions: this.records.filter(permission => permission.client.id === clientId)
    };
  }
};

export const fakeLocationPermissions = {
  records: [
    {
      id: "1",
      clientLocation: fakeClientLocations.records[0],
      permissions: [
        'READ_LOCATION',
        'UPDATE_LOCATION',
        'DELETE_LOCATION',
        'CREATE_LOCATION',
        'MANAGE_LOCATION_DEVICES',
        'READ_LOCATION_EVENTS'
      ],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      location: fakeClientLocations.records[0],
      permissions: ['READ_LOCATION', 'READ_LOCATION_EVENTS'],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ] as ClientLocationPermission[],

  async getLocationPermissions(locationId: string) {
    await delay(1000);
    return {
      permissions: this.records.filter(permission => permission.clientLocation.id === locationId)
    };
  }
};

export const fakeUsers = {
  records: [
    {
      id: "1",
      workspaces: [fakeWorkspaces.records[0]],
      clients: [fakeClients.records[0], fakeClients.records[1]],
      clientLocations: [
        fakeClientLocations.records[0],
        fakeClientLocations.records[1],
        fakeClientLocations.records[2]
      ],
      email: "admin@securitycorpa.com",
      name: "John Admin",
      role: "admin",
      imageUrl: "",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      lastLogin: new Date("2024-03-18T00:00:00Z"),
      permissions: {
        workspace: [fakeWorkspacePermissions.records[0]],
        client: [fakeClientPermissions.records[0]],
        clientLocation: [fakeLocationPermissions.records[0]]
      }
    },
    {
      id: "2",
      workspaces: [fakeWorkspaces.records[0]],
      clients: [fakeClients.records[0]],
      clientLocations: [fakeClientLocations.records[0]],
      email: "user@securitycorpa.com",
      name: "Jane User",
      role: "user",
      imageUrl: "",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      lastLogin: new Date("2024-03-17T00:00:00Z"),
      permissions: {
        workspace: [fakeWorkspacePermissions.records[1]],
        client: [fakeClientPermissions.records[1]],
        clientLocation: [fakeLocationPermissions.records[1]]
      }
    },
    {
      id: "3",
      workspaces: [fakeWorkspaces.records[1]],
      clients: [fakeClients.records[2]],
      clientLocations: [fakeClientLocations.records[3]],
      email: "admin@securitycorpb.com",
      name: "Bob Manager",
      role: "admin",
      imageUrl: "",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      lastLogin: new Date("2024-03-18T00:00:00Z"),
      permissions: {
        workspace: [],
        client: [],
        clientLocation: []
      }
    }
  ] as User[],

  async getUsers(workspaceId: string) {
    await delay(1000);
    return {
      users: this.records.filter(user => 
        user.workspaces.some(ws => ws.id === workspaceId)
      )
    };
  }
};

export type ExtendedSession = Session & {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    permissions: {
      workspace: WorkspacePermission[];
      client: ClientPermission[];
      clientLocation: ClientLocationPermission[];
    };
  };
};

export const mockSession: ExtendedSession = {
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john@acme.com',
    image: 'https://github.com/shadcn.png',
    permissions: {
      workspace: [
        {
          id: '1',
          user: fakeUsers.records[0],
          userStatus: "APPROVED",
          workspace: fakeWorkspaces.records[0],
          permissions: [
            'READ_WORKSPACE',
            'UPDATE_WORKSPACE',
            'DELETE_WORKSPACE',
            'CREATE_WORKSPACE',
            'MANAGE_WORKSPACE_USERS',
            'MANAGE_WORKSPACE_PERMISSIONS',
            'READ_WORKSPACE_LOGS',
            'MANAGE_WORKSPACE_BILLING'
          ],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z"
        }
      ],
      client: [
        {
          id: '1',
          user: fakeUsers.records[0],
          client: fakeClients.records[0],
          permissions: [
            'READ_CLIENT',
            'UPDATE_CLIENT',
            'DELETE_CLIENT',
            'CREATE_CLIENT',
            'MANAGE_CLIENT_USERS'
          ],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z"
        }
      ],
      clientLocation: [
        {
          id: '1',
          user: fakeUsers.records[0],
          clientLocation: fakeClientLocations.records[0],
          permissions: [
            'READ_LOCATION',
            'UPDATE_LOCATION',
            'DELETE_LOCATION',
            'CREATE_LOCATION',
            'MANAGE_LOCATION_DEVICES',
            'READ_LOCATION_EVENTS'
          ],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z"
        }
      ]
    }
  },
  expires: '2024-01-01T00:00:00.000Z'
} as const;