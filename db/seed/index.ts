import { PrismaClient } from '@prisma/client';
import { seedPlatformUsers } from './platform-users';
import { seedWorkspaces } from './workspaces';
import { seedClients } from './clients';
import { seedLocations } from './locations';
import { seedPermissions } from './permissions';
import { seedIncidents } from './incidents';
import { seedAuthSessions } from './auth-sessions';
import { seedOAuthAccounts } from './oauth-accounts';
import { seedStorage } from './storage';

const logSection = (title: string) =>
  console.log(`\n📎 ${title} ${'='.repeat(50 - title.length)}`);
const logStart = (message: string) => console.log(`\n▶️  ${message}`);
const logSuccess = (message: string) => console.log(`✅ ${message}`);
const logError = (message: string, error: any) =>
  console.error(`❌ ${message}`, error);

export const seed = async (prisma: PrismaClient) => {
  try {
    logSection('DATABASE SEEDING START');

    // Core user data
    logSection('CORE USER DATA');

    logStart('Seeding platform users...');
    const platformUsers = await seedPlatformUsers(prisma);
    logSuccess(`Created ${platformUsers.length} platform users`);

    logStart('Seeding auth sessions...');
    await seedAuthSessions(prisma, { platformUsers });
    logSuccess('Auth sessions created');

    logStart('Seeding OAuth accounts...');
    await seedOAuthAccounts(prisma, { platformUsers });
    logSuccess('OAuth accounts created');

    logStart('Seeding storage...');
    await seedStorage(prisma, { platformUsers });
    logSuccess('Storage seeded');

    // Organization structure
    logSection('ORGANIZATION STRUCTURE');

    logStart('Seeding workspaces...');
    const workspaces = await seedWorkspaces(prisma, { count: 5 });
    logSuccess(`Created ${workspaces.length} workspaces`);

    logStart('Seeding clients...');
    const clients = await seedClients(prisma, { workspaces, count: 15 });
    logSuccess(`Created ${clients.length} clients`);

    logStart('Seeding locations...');
    const locations = await seedLocations(prisma, { clients, count: 30 });
    logSuccess(`Created ${locations.length} locations`);

    // Permissions
    logSection('PERMISSIONS');

    logStart('Seeding permissions...');
    await seedPermissions(prisma, {
      workspaces,
      clients,
      locations,
      platformUsers,
      options: { seedUserId: platformUsers[0].id }
    });
    logSuccess('Permissions seeded');

    // Incidents
    logSection('INCIDENTS');

    logStart('Seeding incidents...');
    await seedIncidents(prisma, {
      locations,
      platformUsers,
      count: 50
    });
    logSuccess('Incidents seeded');

    logSection('DATABASE SEEDING COMPLETE');
  } catch (error) {
    logError('Error seeding database:', error);
    throw error;
  }
};

const prisma = new PrismaClient();

seed(prisma)
  .catch((e) => {
    logError('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
