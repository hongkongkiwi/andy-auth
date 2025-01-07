import {
  PrismaClient,
  Role,
  Permission,
  User,
  Workspace,
  Client,
  Patrol
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';
import { FIXED_USER_EMAILS, isFixedUserEmail } from './constants';

interface SeedResourceMembersParams {
  users: User[];
  workspaces: Workspace[];
  clients: Client[];
  patrols: Patrol[];
}

const WORKSPACE_ROLES = [
  Role.OWNER,
  Role.ADMIN,
  Role.MANAGER,
  Role.VIEWER
] as const;
const CLIENT_ROLES = [Role.ADMIN, Role.MANAGER, Role.VIEWER] as const;
const PATROL_ROLES = [Role.ADMIN, Role.MANAGER, Role.VIEWER] as const;

export const seedResourceMembers = async (
  prisma: PrismaClient,
  { users, workspaces, clients, patrols }: SeedResourceMembersParams
) => {
  // Get fixed users by their email addresses
  const workspaceAdmin = users.find(
    (u) => u.email === FIXED_USER_EMAILS.WORKSPACE_ADMIN
  );
  const clientAdmin = users.find(
    (u) => u.email === FIXED_USER_EMAILS.CLIENT_ADMIN
  );
  const patrolAdmin = users.find(
    (u) => u.email === FIXED_USER_EMAILS.PATROL_ADMIN
  );
  const viewer = users.find((u) => u.email === FIXED_USER_EMAILS.VIEWER);

  // Assign specific permissions for fixed users
  if (workspaceAdmin && workspaces.length > 0) {
    await prisma.resourceMember.create({
      data: {
        id: createId(),
        userId: workspaceAdmin.id,
        role: Role.ADMIN,
        permissions: [
          Permission.WORKSPACE_SETTINGS,
          Permission.WORKSPACE_MEMBERS
        ],
        workspaceId: workspaces[0].id
      }
    });
  }

  if (clientAdmin && clients.length > 0) {
    await prisma.resourceMember.create({
      data: {
        id: createId(),
        userId: clientAdmin.id,
        role: Role.ADMIN,
        permissions: [Permission.CLIENT_SETTINGS, Permission.CLIENT_MEMBERS],
        clientId: clients[0].id
      }
    });
  }

  if (patrolAdmin && patrols.length > 0) {
    await prisma.resourceMember.create({
      data: {
        id: createId(),
        userId: patrolAdmin.id,
        role: Role.ADMIN,
        permissions: [Permission.PATROL_SETTINGS, Permission.PATROL_MEMBERS],
        patrolId: patrols[0].id
      }
    });
  }

  // Assign viewer permissions
  if (viewer) {
    for (const workspace of workspaces) {
      await prisma.resourceMember.create({
        data: {
          id: createId(),
          userId: viewer.id,
          role: Role.VIEWER,
          permissions: [],
          workspaceId: workspace.id
        }
      });
    }
  }

  // Seed random permissions for other users
  const regularUsers = users.filter((user) => !isFixedUserEmail(user.email));

  for (const user of regularUsers) {
    await prisma.$transaction(async (tx) => {
      // Workspace permissions
      for (const workspace of workspaces) {
        if (faker.datatype.boolean()) {
          await tx.resourceMember.create({
            data: {
              id: createId(),
              userId: user.id,
              role: faker.helpers.arrayElement(WORKSPACE_ROLES),
              permissions: faker.helpers.arrayElements(
                Object.values(Permission),
                { min: 1, max: 3 }
              ),
              workspaceId: workspace.id
            }
          });
        }
      }

      // Client permissions
      for (const client of clients) {
        if (faker.datatype.boolean()) {
          await tx.resourceMember.create({
            data: {
              id: createId(),
              userId: user.id,
              role: faker.helpers.arrayElement(CLIENT_ROLES),
              permissions: faker.helpers.arrayElements(
                Object.values(Permission),
                { min: 1, max: 3 }
              ),
              clientId: client.id
            }
          });
        }
      }

      // Patrol permissions
      for (const patrol of patrols) {
        if (faker.datatype.boolean()) {
          await tx.resourceMember.create({
            data: {
              id: createId(),
              userId: user.id,
              role: faker.helpers.arrayElement(PATROL_ROLES),
              permissions: faker.helpers.arrayElements(
                Object.values(Permission),
                { min: 1, max: 3 }
              ),
              patrolId: patrol.id
            }
          });
        }
      }
    });
  }
};
