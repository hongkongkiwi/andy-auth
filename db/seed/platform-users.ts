import type { PrismaClient, PlatformUser, Workspace } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { PlatformUserStatus } from '@prisma/client';
import { SeedOptions, DEFAULT_COUNTS } from './types';
import bcrypt from 'bcrypt-mini';
import { DEFAULT_PASSWORD } from '.';
import { Prisma } from '@prisma/client';

type UserCreateInput = {
  emailAddress: string;
  phoneNumber: string;
  userStatus: PlatformUserStatus;
  languageLocale: string;
  timezone: string | null;
  isOnboardingCompleted: boolean;
  settings: Record<string, any>;
  userPassword: string;
  workspaces: {
    connect: { id: string } | { id: string }[];
  };
  personProfile: {
    create: {
      firstName: string;
      lastName: string;
      profileImage: string;
      emergencyContact: {
        name: string;
        phoneNumber: string;
        emailAddress: string;
        relationship: string;
      };
    };
  };
};

const FIXED_USERS = [
  {
    firstName: 'Andy',
    lastName: 'Savage',
    emailAddress: 'andy@savage.hk'
  },
  {
    firstName: 'Test',
    lastName: 'Admin',
    emailAddress: 'admin@test.com'
  },
  {
    firstName: 'Test',
    lastName: 'Guard',
    emailAddress: 'guard@test.com'
  },
  {
    firstName: 'Test',
    lastName: 'Manager',
    emailAddress: 'manager@test.com'
  }
] as const;

export const seedPlatformUsers = async (
  prisma: PrismaClient,
  workspaces: Workspace[],
  options: SeedOptions = {}
): Promise<PlatformUser[]> => {
  const usersPerWorkspace =
    options.usersPerWorkspace ?? DEFAULT_COUNTS.usersPerWorkspace;
  const users: PlatformUser[] = [];

  // Hash the default password
  const hashedPassword = bcrypt.hashSync(DEFAULT_PASSWORD, 10);

  // Create random users first
  for (const workspace of workspaces) {
    await Promise.all(
      Array.from({ length: usersPerWorkspace }, async () => {
        const user = await prisma.$transaction(
          async (tx): Promise<PlatformUser> => {
            // Create user first
            const createdUser = await tx.platformUser.create({
              data: {
                emailAddress: faker.internet.email().toLowerCase(),
                phoneNumber: `+${faker.string.numeric(11)}`,
                userStatus: PlatformUserStatus.ACTIVE,
                languageLocale: 'en',
                timezone: workspace.timezone,
                isOnboardingCompleted: true,
                settings: {},
                userPassword: hashedPassword,
                workspaces: {
                  connect: { id: workspace.id }
                }
              } as Prisma.PlatformUserUncheckedCreateInput
            });

            // Create profile with user reference
            const profile = await tx.userProfile.create({
              data: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                profileImage: faker.image.avatar(),
                emergencyContact: {
                  name: faker.person.fullName(),
                  phoneNumber: faker.phone.number(),
                  emailAddress: faker.internet.email().toLowerCase(),
                  relationship: faker.helpers.arrayElement([
                    'Spouse',
                    'Parent',
                    'Sibling',
                    'Friend'
                  ])
                },
                userId: createdUser.id // Link to user
              }
            });

            // Update user with profile reference
            return tx.platformUser.update({
              where: { id: createdUser.id },
              data: { personProfileId: profile.id }
            });
          }
        );
        users.push(user);
      })
    );
  }

  // Create fixed users sequentially to avoid conflicts
  for (const fixedUser of FIXED_USERS) {
    const user = await prisma.$transaction(
      async (tx): Promise<PlatformUser> => {
        // Create user first
        const createdUser = await tx.platformUser.create({
          data: {
            emailAddress: fixedUser.emailAddress,
            phoneNumber: `+${faker.string.numeric(11)}`,
            userStatus: PlatformUserStatus.ACTIVE,
            languageLocale: 'en',
            timezone: 'UTC',
            isOnboardingCompleted: true,
            settings: {},
            userPassword: hashedPassword,
            workspaces: {
              connect: workspaces.map((w) => ({ id: w.id }))
            }
          } as Prisma.PlatformUserUncheckedCreateInput
        });

        // Create profile with user reference
        const profile = await tx.userProfile.create({
          data: {
            firstName: fixedUser.firstName,
            lastName: fixedUser.lastName,
            profileImage: faker.image.avatar(),
            emergencyContact: {
              name: faker.person.fullName(),
              phoneNumber: faker.phone.number(),
              emailAddress: faker.internet.email().toLowerCase(),
              relationship: 'Emergency Contact'
            },
            userId: createdUser.id
          }
        });

        // Update user with profile reference
        return tx.platformUser.update({
          where: { id: createdUser.id },
          data: { personProfileId: profile.id }
        });
      }
    );
    users.push(user);
  }

  // Create guard profile for the guard user
  const guardUser = users.find((u) => u.emailAddress === 'guard@test.com');
  if (guardUser) {
    await prisma.guardProfile.create({
      data: {
        guardStaffId: faker.string.alphanumeric(8).toUpperCase(),
        guardPinNumber: faker.string.numeric(6),
        userId: guardUser.id
      }
    });
  }

  return users;
};
