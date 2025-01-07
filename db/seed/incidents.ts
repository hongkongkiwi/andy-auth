import {
  Prisma,
  PrismaClient,
  User,
  Patrol,
  Incident,
  IncidentStatus,
  IncidentSeverity,
  IncidentCategory
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

interface SeedIncidentsParams {
  patrols: Patrol[];
  users: User[];
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

export const seedIncidents = async (
  prisma: PrismaClient,
  { patrols, users, count }: SeedIncidentsParams
): Promise<Incident[]> => {
  const incidents: Incident[] = [];

  await Promise.all(
    Array.from({ length: count }, async () => {
      const patrol = faker.helpers.arrayElement(patrols);

      const incident = await prisma.incident.create({
        data: {
          id: createId(),
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraphs(2),
          status: faker.helpers.arrayElement(Object.values(IncidentStatus)),
          occurredAt: faker.date.recent(),
          severity: faker.helpers.arrayElement(Object.values(IncidentSeverity)),
          category: faker.helpers.arrayElement(Object.values(IncidentCategory)),
          address: generateAddress() as Prisma.InputJsonValue,
          responseTime: faker.number.int({ min: 5, max: 120 }),
          resolutionTime: faker.number.int({ min: 30, max: 480 }),
          assignedAt: faker.date.recent(),
          priority: faker.number.int({ min: 1, max: 5 }),
          dueDate: faker.date.future(),
          tags: faker.helpers.arrayElements(
            ['urgent', 'security', 'maintenance', 'safety'],
            { min: 1, max: 3 }
          ),
          patrolId: patrol.id,
          clientId: patrol.clientId
        }
      });

      incidents.push(incident);
      return incident;
    })
  );

  return incidents;
};
