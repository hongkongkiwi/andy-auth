import type {
  PrismaClient,
  Incident,
  Workspace,
  Client,
  PlatformUser,
  Device
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { SeedOptions, DEFAULT_COUNTS } from './types';

interface SeedIncidentsParams {
  workspaces: Workspace[];
  clients: Client[];
  platformUsers: PlatformUser[];
  devices: Device[];
}

export const seedIncidents = async (
  prisma: PrismaClient,
  { workspaces, clients, platformUsers, devices }: SeedIncidentsParams,
  options: SeedOptions = {}
): Promise<Incident[]> => {
  const incidentsPerClient =
    options.incidentsPerClient ?? DEFAULT_COUNTS.incidentsPerClient;
  const incidents: Incident[] = [];

  // First create some incident priorities and statuses
  const priorities = await Promise.all([
    prisma.incidentPriority.create({
      data: {
        name: 'Critical',
        description: 'Immediate attention required',
        level: 1
      }
    }),
    prisma.incidentPriority.create({
      data: { name: 'High', description: 'Urgent attention needed', level: 2 }
    }),
    prisma.incidentPriority.create({
      data: { name: 'Medium', description: 'Standard priority', level: 3 }
    }),
    prisma.incidentPriority.create({
      data: { name: 'Low', description: 'Non-urgent', level: 4 }
    })
  ]);

  const statuses = await Promise.all([
    prisma.incidentStatus.create({
      data: {
        name: 'Open',
        type: 'ongoing'
      }
    }),
    prisma.incidentStatus.create({
      data: {
        name: 'In Progress',
        type: 'ongoing'
      }
    }),
    prisma.incidentStatus.create({
      data: {
        name: 'Resolved',
        type: 'resolved'
      }
    })
  ]);

  // Add incident categories
  const incidentCategories = [
    { name: 'Security Breach', severity: 'HIGH' },
    { name: 'Suspicious Activity', severity: 'MEDIUM' },
    { name: 'Property Damage', severity: 'MEDIUM' },
    { name: 'Medical Emergency', severity: 'HIGH' },
    { name: 'Fire Safety', severity: 'HIGH' },
    { name: 'Maintenance Issue', severity: 'LOW' },
    { name: 'Parking Violation', severity: 'LOW' },
    { name: 'Trespassing', severity: 'MEDIUM' }
  ];

  for (const workspace of workspaces) {
    const workspaceClients = clients.filter(
      (c) => c.workspaceId === workspace.id
    );
    const workspacePlatformUsers = await prisma.platformUser.findMany({
      where: {
        workspaces: {
          some: { id: workspace.id }
        }
      }
    });

    for (const client of workspaceClients) {
      // Get client locations
      const locations = await prisma.clientLocation.findMany({
        where: { clientId: client.id }
      });

      await Promise.all(
        Array.from({ length: incidentsPerClient }, async () => {
          const incident = await prisma.incident.create({
            data: {
              shortSummary: faker.lorem.sentence(),
              description: faker.lorem.paragraphs(2),
              priorityId: faker.helpers.arrayElement(priorities).id,
              statusId: faker.helpers.arrayElement(statuses).id,
              deviceId: faker.helpers.arrayElement(devices).id,
              clientId: client.id,
              locationId: faker.helpers.arrayElement(locations).id,
              workspaceId: workspace.id,
              isInProgress: faker.datatype.boolean(),
              media: {
                create: {
                  objectKey: faker.string.uuid(),
                  objectBucket: 'incidents',
                  objectRegion: 'us-east-1',
                  storageService: 'S3',
                  mimeType: 'image/jpeg',
                  modifiedAt: new Date(),
                  metadata: {
                    filename: 'incident.jpg',
                    contentType: 'image/jpeg'
                  }
                }
              }
            }
          });
          incidents.push(incident);
          return incident;
        })
      );
    }
  }

  return incidents;
};
