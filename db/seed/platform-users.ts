import {
  PrismaClient,
  PlatformUser,
  PlatformUserStatus,
  PermissionType
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';
import { hashSync } from 'bcrypt-mini';
import { FIXED_USER_EMAILS } from './constants';

const DEFAULT_RANDOM_USERS = 5;

interface FixedUserPermission {
  type: PermissionType;
  workspaceId?: string;
  clientId?: string;
  locationId?: string;
}

interface FixedUser {
  emailAddress: string;
  name: string;
  password: string;
  status: PlatformUserStatus;
  permissions: FixedUserPermission[];
}

// Define fixed test users with their permissions
const FIXED_USERS: FixedUser[] = [
  {
    emailAddress: FIXED_USER_EMAILS.ADMIN,
    name: 'Admin User',
    password: 'admin123',
    status: PlatformUserStatus.ACTIVE,
    permissions: [{ type: PermissionType.PLATFORM_ADMIN }]
  },
  {
    emailAddress: FIXED_USER_EMAILS.WORKSPACE_ADMIN,
    name: 'Workspace Admin',
    password: 'password123',
    status: PlatformUserStatus.ACTIVE,
    permissions: [
      { type: PermissionType.PLATFORM_USER },
      { type: PermissionType.WORKSPACE_ADMIN }
      // workspaceId will be assigned during workspace creation
    ]
  },
  {
    emailAddress: FIXED_USER_EMAILS.CLIENT_ADMIN,
    name: 'Client Admin',
    password: 'password123',
    status: PlatformUserStatus.ACTIVE,
    permissions: [
      { type: PermissionType.PLATFORM_USER },
      { type: PermissionType.CLIENT_ADMIN }
      // clientId will be assigned during client creation
    ]
  },
  {
    emailAddress: FIXED_USER_EMAILS.LOCATION_ADMIN,
    name: 'Location Admin',
    password: 'password123',
    status: PlatformUserStatus.ACTIVE,
    permissions: [
      { type: PermissionType.PLATFORM_USER },
      { type: PermissionType.LOCATION_ADMIN }
      // locationId will be assigned during location creation
    ]
  },
  {
    emailAddress: FIXED_USER_EMAILS.VIEWER,
    name: 'Regular Viewer',
    password: 'password123',
    status: PlatformUserStatus.ACTIVE,
    permissions: [
      { type: PermissionType.PLATFORM_USER },
      { type: PermissionType.WORKSPACE_VIEWER },
      { type: PermissionType.CLIENT_VIEWER },
      { type: PermissionType.LOCATION_VIEWER }
    ]
  },
  {
    emailAddress: FIXED_USER_EMAILS.PENDING,
    name: 'Pending User',
    password: 'password123',
    status: PlatformUserStatus.PENDING,
    permissions: [{ type: PermissionType.PLATFORM_USER }]
  }
];

export const seedPlatformUsers = async (
  prisma: PrismaClient
): Promise<PlatformUser[]> => {
  const users: PlatformUser[] = [];

  // Create or update fixed users
  for (const fixedUser of FIXED_USERS) {
    let user = await prisma.platformUser.findUnique({
      where: { emailAddress: fixedUser.emailAddress }
    });

    if (!user) {
      user = await prisma.platformUser.create({
        data: {
          id: createId(),
          emailAddress: fixedUser.emailAddress,
          name: fixedUser.name,
          passwordHash: await hashSync(fixedUser.password, 10),
          emailAddressVerifiedAt:
            fixedUser.status === PlatformUserStatus.ACTIVE ? new Date() : null,
          status: fixedUser.status,
          phoneNumber: faker.phone.number(),
          phoneNumberVerifiedAt:
            fixedUser.status === PlatformUserStatus.ACTIVE ? new Date() : null,
          permissions: {
            create: fixedUser.permissions.map((permission) => ({
              id: createId(),
              type: permission.type,
              workspaceId: permission.workspaceId,
              clientId: permission.clientId,
              locationId: permission.locationId,
              lastAccessedAt: new Date()
            }))
          }
        }
      });
    }
    users.push(user);
  }

  // Create random users
  const existingCount = users.length;
  await Promise.all(
    Array.from({ length: DEFAULT_RANDOM_USERS }, async (_, index) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = `user${existingCount + index + 1}@example.com`;

      // Check if user already exists
      const existingUser = await prisma.platformUser.findUnique({
        where: { emailAddress: email }
      });

      if (existingUser) {
        users.push(existingUser);
        return existingUser;
      }

      const user = await prisma.platformUser.create({
        data: {
          id: createId(),
          emailAddress: email,
          name: `${firstName} ${lastName}`,
          passwordHash: await hashSync('password123', 10),
          emailAddressVerifiedAt: faker.datatype.boolean() ? new Date() : null,
          status: PlatformUserStatus.ACTIVE,
          phoneNumber: faker.phone.number(),
          phoneNumberVerifiedAt: null,
          permissions: {
            create: [
              {
                id: createId(),
                type: PermissionType.PLATFORM_USER,
                lastAccessedAt: new Date()
              }
            ]
          }
        }
      });

      users.push(user);
      return user;
    })
  );

  return users;
};
