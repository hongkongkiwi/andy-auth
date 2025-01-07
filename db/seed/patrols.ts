import {
  Prisma,
  PrismaClient,
  EntityStatus,
  Client,
  Patrol
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

interface SeedPatrolsParams {
  clients: Client[];
  count: number;
}

const generateAddress = (): Prisma.JsonValue => ({
  placeId: createId(),
  formattedAddress: faker.location.streetAddress(true),
  latitude: Number(faker.location.latitude()),
  longitude: Number(faker.location.longitude()),
  streetNumber: faker.location.buildingNumber(),
  route: faker.location.street(),
  locality: faker.location.city(),
  administrativeAreaLevel1: faker.location.state(),
  country: faker.location.country(),
  postalCode: faker.location.zipCode(),
  raw: null
});

const generatePatrolSettings = (): Prisma.JsonValue => ({
  checkpoints: faker.number.int({ min: 3, max: 10 }),
  requiredPhotos: faker.number.int({ min: 0, max: 5 }),
  requiredNotes: faker.datatype.boolean(),
  geofencing: {
    enabled: faker.datatype.boolean(),
    radius: faker.number.int({ min: 50, max: 500 })
  }
});

export const seedPatrols = async (
  prisma: PrismaClient,
  { clients, count }: SeedPatrolsParams
): Promise<Patrol[]> => {
  const patrols: Patrol[] = [];

  await Promise.all(
    Array.from({ length: count }, async () => {
      const client = faker.helpers.arrayElement(clients);

      const patrol = await prisma.patrol.create({
        data: {
          id: createId(),
          name: faker.company.name(),
          description: faker.company.catchPhrase(),
          status: EntityStatus.ACTIVE,
          address: generateAddress() as Prisma.InputJsonValue,
          patrolSettings: generatePatrolSettings() as Prisma.InputJsonValue,
          clientId: client.id
        }
      });

      patrols.push(patrol);
      return patrol;
    })
  );

  return patrols;
};
