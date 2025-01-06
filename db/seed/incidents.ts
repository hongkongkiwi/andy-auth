import type {
  PrismaClient,
  Incident,
  Location,
  PlatformUser
} from '@prisma/client';
import {
  IncidentStatus,
  IncidentSeverity,
  IncidentCategory,
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel,
  PermissionType
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

interface SeedIncidentsParams {
  locations: Location[];
  platformUsers: PlatformUser[];
  count: number;
}

const generateAddress = () => ({
  placeId: createId(),
  formattedAddress: faker.location.streetAddress(true),
  latitude: Number(faker.location.latitude()),
  longitude: Number(faker.location.longitude()),
  raw: null
});

export const seedIncidents = async (
  prisma: PrismaClient,
  { locations, platformUsers, count }: SeedIncidentsParams
) => {
  // Get users who can be assigned incidents
  const assignableUsers = await prisma.platformUser.findMany({
    where: {
      permissions: {
        some: {
          type: {
            in: [
              PermissionType.PLATFORM_ADMIN,
              PermissionType.WORKSPACE_ADMIN,
              PermissionType.CLIENT_ADMIN
            ]
          }
        }
      }
    }
  });

  const incidents: Incident[] = [];

  // Create incidents distributed across locations
  await Promise.all(
    Array.from({ length: count }, async () => {
      const location = faker.helpers.arrayElement(locations);

      return prisma.$transaction(async (tx) => {
        const incident = await tx.incident.create({
          data: {
            id: createId(),
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraphs(2),
            status: IncidentStatus.REPORTED,
            occurredAt: faker.date.recent(),
            severity: faker.helpers.arrayElement(
              Object.values(IncidentSeverity)
            ),
            category: faker.helpers.arrayElement(
              Object.values(IncidentCategory)
            ),
            address: generateAddress(),
            responseTime: faker.number.int({ min: 5, max: 120 }),
            resolutionTime: faker.number.int({ min: 30, max: 480 }),
            assignedToId: faker.helpers.arrayElement(assignableUsers).id,
            assignedAt: faker.date.recent(),
            priority: faker.number.int({ min: 1, max: 5 }),
            dueDate: faker.date.future(),
            tags: faker.helpers.arrayElements(
              ['urgent', 'security', 'maintenance', 'safety'],
              { min: 1, max: 3 }
            ),
            locationId: location.id,
            clientId: location.clientId
          }
        });

        incidents.push(incident);
        return incident;
      });
    })
  );

  return incidents;
};
