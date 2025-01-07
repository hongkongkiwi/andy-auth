import { PrismaClient, AuthSession, User, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

interface SeedSessionsParams {
  users: User[];
}

export const seedSessions = async (
  prisma: PrismaClient,
  { users }: SeedSessionsParams
): Promise<AuthSession[]> => {
  const sessions: AuthSession[] = [];

  await Promise.all(
    users.map(async (user) => {
      const sessionCount = faker.number.int({ min: 1, max: 3 });

      for (let i = 0; i < sessionCount; i++) {
        const session = await prisma.authSession.create({
          data: {
            id: createId(),
            userId: user.id,
            token: createId(),
            expiresAt: faker.date.future(),
            lastActiveAt: faker.date.recent(),
            ipAddress: faker.internet.ip(),
            userAgent: faker.internet.userAgent(),
            deviceId: createId(),
            deviceName: faker.commerce.product(),
            sessionType: 'web',
            mfaVerified: false,
            failedAttempts: 0,
            isRevoked: false,
            geoPatrol: Prisma.JsonNull
          }
        });
        sessions.push(session);
      }
    })
  );

  return sessions;
};
