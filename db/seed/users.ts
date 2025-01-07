import {
  PrismaClient,
  User,
  UserStatus,
  Role,
  Permission
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';
import { hashSync } from 'bcrypt-mini';
import { FIXED_USER_EMAILS } from './constants';

const DEFAULT_RANDOM_USERS = 5;

interface FixedUser {
  email: string;
  name: string;
  password: string;
  status: UserStatus;
  isPlatformAdmin: boolean;
}

const FIXED_USERS: FixedUser[] = [
  {
    email: FIXED_USER_EMAILS.ADMIN,
    name: 'Admin User',
    password: 'admin123',
    status: UserStatus.ACTIVE,
    isPlatformAdmin: true
  },
  {
    email: FIXED_USER_EMAILS.WORKSPACE_ADMIN,
    name: 'Workspace Admin',
    password: 'password123',
    status: UserStatus.ACTIVE,
    isPlatformAdmin: false
  }
  // ... add other fixed users
];

export const seedUsers = async (prisma: PrismaClient): Promise<User[]> => {
  const users: User[] = [];

  // Create fixed users
  for (const fixedUser of FIXED_USERS) {
    let user = await prisma.user.findUnique({
      where: { email: fixedUser.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: createId(),
          email: fixedUser.email,
          name: fixedUser.name,
          password: await hashSync(fixedUser.password, 10),
          emailVerified:
            fixedUser.status === UserStatus.ACTIVE ? new Date() : null,
          status: fixedUser.status,
          isPlatformAdmin: fixedUser.isPlatformAdmin,
          phoneNumber: faker.phone.number(),
          phoneVerified:
            fixedUser.status === UserStatus.ACTIVE ? new Date() : null,
          mfaEnabled: false
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
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        users.push(existingUser);
        return existingUser;
      }

      const user = await prisma.user.create({
        data: {
          id: createId(),
          email,
          name: `${firstName} ${lastName}`,
          password: await hashSync('password123', 10),
          emailVerified: faker.datatype.boolean() ? new Date() : null,
          status: UserStatus.ACTIVE,
          phoneNumber: faker.phone.number(),
          phoneVerified: null
        }
      });

      users.push(user);
      return user;
    })
  );

  return users;
};
