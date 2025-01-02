import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { seedWorkspaces } from './workspaces';
import { seedClients } from './clients';
import { seedPlatformUsers } from './platform-users';
import { seedDevices } from './devices';
import { seedIncidents } from './incidents';
import { seedPatrols } from './patrols';
import { SeedOptions, DEFAULT_COUNTS, SeedError } from './types';

export const DEFAULT_PASSWORD = 'test1234';

const prisma = new PrismaClient();

// Add back the clearDatabase function
const clearDatabase = async (prisma: PrismaClient) => {
  // Delete in reverse order of dependencies
  await Promise.all([
    prisma.patrolSession.deleteMany(),
    prisma.checkpointScan.deleteMany(),
    prisma.checkpoint.deleteMany(),
    prisma.patrolRoute.deleteMany(),
    prisma.objectStorageFile.deleteMany(),
    prisma.incident.deleteMany(),
    prisma.device.deleteMany()
  ]);

  await Promise.all([
    prisma.clientLocationPermission.deleteMany(),
    prisma.clientPermission.deleteMany(),
    prisma.workspacePermission.deleteMany(),
    prisma.clientLocation.deleteMany(),
    prisma.client.deleteMany()
  ]);

  await Promise.all([
    prisma.incidentStatus.deleteMany(),
    prisma.incidentPriority.deleteMany(),
    prisma.guardProfile.deleteMany(),
    prisma.platformUserSession.deleteMany(),
    prisma.platformUserAccount.deleteMany(),
    prisma.platformUser.deleteMany(),
    prisma.workspace.deleteMany()
  ]);
};

export const seedDatabase = async (options: SeedOptions = {}) => {
  const startTime = Date.now();
  const verbose = options.verbose ?? true;

  const log = (message: string) => {
    if (verbose) console.log(message);
  };

  log('🌱 Starting database seeding...');
  const seedName = `seed_${Date.now()}`;

  try {
    // Record seed execution start
    await prisma.seedExecution.create({
      data: {
        seedName,
        executedAt: new Date()
      }
    });

    await clearDatabase(prisma);

    log('📦 Seeding workspaces...');
    const workspaces = await seedWorkspaces(prisma, options);

    log('👥 Seeding clients...');
    const clients = await seedClients(prisma, workspaces, options);

    log('👤 Seeding platform users and guard profiles...');
    const platformUsers = await seedPlatformUsers(prisma, workspaces, options);
    log('🔑 Default platform user password: test1234');

    // Get all guard profiles for patrol seeding
    const guardProfiles = await prisma.guardProfile.findMany({
      include: { user: true }
    });

    log('📱 Seeding devices...');
    const devices = await seedDevices(prisma, { workspaces, clients, options });

    // Get all locations for patrol seeding
    const locations = await prisma.clientLocation.findMany();

    log('🚨 Seeding incidents...');
    await seedIncidents(prisma, {
      workspaces,
      clients,
      platformUsers,
      devices
    });

    log('🚶 Seeding patrols...');
    await seedPatrols(
      prisma,
      {
        workspaces,
        platformUsers: guardProfiles,
        devices,
        locations
      },
      options
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`✅ Database seeded successfully in ${duration}s!`);

    if (verbose) {
      const counts = await getCounts(prisma);
      console.table(counts);
    }
  } catch (error: unknown) {
    if (error instanceof SeedError) {
      console.error('❌ Seeding failed:', error.message, error.context);
    } else if (error instanceof Error) {
      console.error('❌ Unexpected error during seeding:', error.message);
    } else {
      console.error('❌ Unexpected error during seeding:', error);
    }
    throw error;
  }
};

// Add helper to get final counts
const getCounts = async (prisma: PrismaClient) => {
  const [
    workspaces,
    clients,
    clientLocations,
    platformUsers,
    guardProfiles,
    devices,
    incidents,
    patrolRoutes,
    patrolSessions,
    checkpoints
  ] = await Promise.all([
    prisma.workspace.count(),
    prisma.client.count(),
    prisma.clientLocation.count(),
    prisma.platformUser.count(),
    prisma.guardProfile.count(),
    prisma.device.count(),
    prisma.incident.count(),
    prisma.patrolRoute.count(),
    prisma.patrolSession.count(),
    prisma.checkpoint.count()
  ]);

  return {
    workspaces,
    clients,
    clientLocations,
    platformUsers,
    guardProfiles,
    devices,
    incidents,
    patrolRoutes,
    patrolSessions,
    checkpoints
  };
};

const main = async () => {
  await seedDatabase();
};

// Use this as the entry point
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
