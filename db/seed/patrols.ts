import type {
  PrismaClient,
  GuardProfile,
  Device,
  ClientLocation,
  Workspace
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { SeedOptions, DEFAULT_COUNTS } from './types';

interface SeedPatrolsParams {
  workspaces: Workspace[];
  platformUsers: GuardProfile[];
  devices: Device[];
  locations: ClientLocation[];
}

enum PatrolStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  MISSED = 'MISSED'
}

// Add checkpoint types with more specific names
const checkpointTypes = [
  'Entry Point',
  'Exit Point',
  'Perimeter',
  'Critical Asset',
  'Common Area',
  'Parking Area',
  'Loading Dock',
  'Emergency Exit'
];

// Add checkpoint areas to make names more unique
const checkpointAreas = [
  'North',
  'South',
  'East',
  'West',
  'Main',
  'Back',
  'Front',
  'Side'
];

const checkpointActions = [
  'Visual Inspection',
  'Door Check',
  'Camera Check',
  'Equipment Check',
  'Safety Check',
  'Fire Extinguisher Check',
  'Emergency Exit Check',
  'Window Check',
  'Perimeter Check',
  'Access Control Check',
  'Lighting Check',
  'HVAC Check',
  'Alarm System Check',
  'Elevator Check',
  'Parking Area Check'
];

export const seedPatrols = async (
  prisma: PrismaClient,
  { workspaces, platformUsers, devices, locations }: SeedPatrolsParams,
  options: SeedOptions = {}
): Promise<void> => {
  for (const location of locations) {
    const client = await prisma.client.findUnique({
      where: { id: location.clientId }
    });
    if (!client) continue;

    // Generate all unique names first
    const checkpointNames = new Set<string>();
    while (checkpointNames.size < 5) {
      const area = faker.helpers.arrayElement(checkpointAreas);
      const type = faker.helpers.arrayElement(checkpointTypes);
      const name = `${area} ${type} - ${faker.string.alphanumeric(4)}`;
      checkpointNames.add(name);
    }

    // Create checkpoints sequentially
    const checkpoints = [];
    for (const name of Array.from(checkpointNames)) {
      const checkpoint = await prisma.checkpoint.create({
        data: {
          name,
          description: faker.lorem.sentence(),
          qrCode: faker.string.uuid(),
          nfcTagId: faker.string.uuid(),
          coordinates: {
            latitude: Number(faker.location.latitude()),
            longitude: Number(faker.location.longitude())
          },
          locationId: location.id,
          type: faker.helpers.arrayElement(checkpointTypes),
          actions: faker.helpers.arrayElements(checkpointActions, {
            min: 2,
            max: 5
          })
        }
      });
      checkpoints.push(checkpoint);
    }

    const workspace = workspaces.find((w) => w.id === client.workspaceId);
    if (!workspace) {
      throw new Error(`No workspace found for client ${client.id}`);
    }

    // Create patrol route
    const route = await prisma.patrolRoute.create({
      data: {
        routeName: `${location.displayName} Standard Route`,
        description: faker.lorem.sentence(),
        clientId: client.id,
        workspaceId: workspace.id,
        locationId: location.id,
        checkpoints: {
          connect: checkpoints.map((cp) => ({ id: cp.id }))
        }
      }
    });

    // Get platform users for this workspace
    const locationGuards = await prisma.guardProfile.findMany({
      where: {
        user: {
          workspaces: {
            some: { id: client.workspaceId }
          }
        }
      }
    });
    const locationDevices = devices.filter((d) => d.clientId === client.id);

    // Create patrol sessions sequentially
    for (let i = 0; i < 3; i++) {
      const startTime = faker.date.recent();
      const session = await prisma.patrolSession.create({
        data: {
          startedAt: startTime,
          finishedAt: faker.helpers.maybe(() =>
            faker.date.soon({ refDate: startTime })
          ),
          isInProgress: faker.datatype.boolean(),
          notes: faker.helpers.maybe(() => faker.lorem.sentence()),
          patrolRouteId: route.id,
          guardProfileId: faker.helpers.arrayElement(locationGuards).id,
          deviceId: faker.helpers.arrayElement(locationDevices).id
        }
      });
    }
  }
};
