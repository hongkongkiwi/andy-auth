import { PrismaClient, PlatformUser, AuthSession } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

interface SeedAuthSessionsParams {
  platformUsers: PlatformUser[];
}

const generateDeviceInfo = () => ({
  os: faker.helpers.arrayElement([
    'iOS',
    'Android',
    'Windows',
    'macOS',
    'Linux'
  ]),
  browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
  device: faker.helpers.arrayElement(['Desktop', 'Mobile', 'Tablet']),
  version: faker.system.semver()
});

export const seedAuthSessions = async (
  prisma: PrismaClient,
  { platformUsers }: SeedAuthSessionsParams
): Promise<AuthSession[]> => {
  const sessions: AuthSession[] = [];

  await Promise.all(
    platformUsers.map(async (user) => {
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
            deviceInfo: generateDeviceInfo(),
            geoLocation: {
              city: faker.location.city(),
              country: faker.location.country(),
              latitude: Number(faker.location.latitude()),
              longitude: Number(faker.location.longitude())
            }
          }
        });
        sessions.push(session);
      }
    })
  );

  return sessions;
};
