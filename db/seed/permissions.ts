import {
  PrismaClient,
  Prisma,
  Workspace,
  Client,
  Location,
  PlatformUser,
  PermissionType
} from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';
import { faker } from '@faker-js/faker';
import { SeedOptions } from './types';
import { FIXED_USER_EMAILS, isFixedUserEmail } from './constants';

interface SeedPermissionsParams {
  workspaces: Workspace[];
  clients: Client[];
  locations: Location[];
  platformUsers: PlatformUser[];
  options: SeedOptions;
}

const WORKSPACE_PERMISSIONS = [
  PermissionType.WORKSPACE_ADMIN,
  PermissionType.WORKSPACE_EDITOR,
  PermissionType.WORKSPACE_VIEWER
] as const;

const CLIENT_PERMISSIONS = [
  PermissionType.CLIENT_ADMIN,
  PermissionType.CLIENT_EDITOR,
  PermissionType.CLIENT_VIEWER
] as const;

const LOCATION_PERMISSIONS = [
  PermissionType.LOCATION_ADMIN,
  PermissionType.LOCATION_EDITOR,
  PermissionType.LOCATION_VIEWER
] as const;

const createPermission = async (
  tx: Prisma.TransactionClient,
  data: {
    userId: string;
    type: PermissionType;
    workspaceId?: string;
    clientId?: string;
    locationId?: string;
    lastAccessedAt?: Date;
  }
) => {
  return tx.permission.create({
    data: {
      id: createId(),
      ...data
    }
  });
};

export const seedPermissions = async (
  prisma: PrismaClient,
  {
    workspaces,
    clients,
    locations,
    platformUsers,
    options
  }: SeedPermissionsParams
) => {
  // Get fixed users by their email addresses
  const workspaceAdmin = await prisma.platformUser.findUnique({
    where: { emailAddress: FIXED_USER_EMAILS.WORKSPACE_ADMIN },
    include: { permissions: true }
  });
  const clientAdmin = await prisma.platformUser.findUnique({
    where: { emailAddress: FIXED_USER_EMAILS.CLIENT_ADMIN },
    include: { permissions: true }
  });
  const locationAdmin = await prisma.platformUser.findUnique({
    where: { emailAddress: FIXED_USER_EMAILS.LOCATION_ADMIN },
    include: { permissions: true }
  });
  const viewer = await prisma.platformUser.findUnique({
    where: { emailAddress: FIXED_USER_EMAILS.VIEWER },
    include: { permissions: true }
  });

  // Assign specific permissions for fixed users if they don't already have them
  if (workspaceAdmin && workspaces.length > 0) {
    const hasWorkspacePermission = workspaceAdmin.permissions.some(
      (p) =>
        p.type === PermissionType.WORKSPACE_ADMIN &&
        p.workspaceId === workspaces[0].id
    );

    if (!hasWorkspacePermission) {
      await prisma.permission.create({
        data: {
          id: createId(),
          userId: workspaceAdmin.id,
          type: PermissionType.WORKSPACE_ADMIN,
          workspaceId: workspaces[0].id,
          lastAccessedAt: new Date()
        }
      });
    }
  }

  if (clientAdmin && clients.length > 0) {
    const hasClientPermission = clientAdmin.permissions.some(
      (p) =>
        p.type === PermissionType.CLIENT_ADMIN && p.clientId === clients[0].id
    );

    if (!hasClientPermission) {
      await prisma.permission.create({
        data: {
          id: createId(),
          userId: clientAdmin.id,
          type: PermissionType.CLIENT_ADMIN,
          clientId: clients[0].id,
          lastAccessedAt: new Date()
        }
      });
    }
  }

  if (locationAdmin && locations.length > 0) {
    const hasLocationPermission = locationAdmin.permissions.some(
      (p) =>
        p.type === PermissionType.LOCATION_ADMIN &&
        p.locationId === locations[0].id
    );

    if (!hasLocationPermission) {
      await prisma.permission.create({
        data: {
          id: createId(),
          userId: locationAdmin.id,
          type: PermissionType.LOCATION_ADMIN,
          locationId: locations[0].id,
          lastAccessedAt: new Date()
        }
      });
    }
  }

  // Assign viewer permissions if they don't exist
  if (viewer) {
    for (const workspace of workspaces) {
      const hasWorkspacePermission = viewer.permissions.some(
        (p) =>
          p.type === PermissionType.WORKSPACE_VIEWER &&
          p.workspaceId === workspace.id
      );

      if (!hasWorkspacePermission) {
        await prisma.permission.create({
          data: {
            id: createId(),
            userId: viewer.id,
            type: PermissionType.WORKSPACE_VIEWER,
            workspaceId: workspace.id,
            lastAccessedAt: new Date()
          }
        });
      }
    }
  }

  // Seed random permissions for other users
  const regularUsers = platformUsers.filter(
    (user) => user.emailAddress && !isFixedUserEmail(user.emailAddress)
  );

  // Continue with random permission seeding for regular users...
  for (const user of regularUsers) {
    await prisma.$transaction(async (tx) => {
      try {
        // Platform permissions
        await createPermission(tx, {
          userId: user.id,
          type:
            user === platformUsers[0]
              ? PermissionType.PLATFORM_ADMIN
              : PermissionType.PLATFORM_USER
        });

        // Random workspace permissions
        for (const workspace of workspaces) {
          await createPermission(tx, {
            userId: user.id,
            type: faker.helpers.arrayElement(WORKSPACE_PERMISSIONS),
            workspaceId: workspace.id,
            lastAccessedAt: faker.date.past()
          });
        }

        // Random client permissions
        for (const client of clients) {
          await createPermission(tx, {
            userId: user.id,
            type: faker.helpers.arrayElement(CLIENT_PERMISSIONS),
            clientId: client.id
          });
        }

        // Random location permissions
        for (const location of locations) {
          await createPermission(tx, {
            userId: user.id,
            type: faker.helpers.arrayElement(LOCATION_PERMISSIONS),
            locationId: location.id
          });
        }
      } catch (error) {
        console.error('Error seeding permissions:', error);
        throw error;
      }
    });
  }
};
