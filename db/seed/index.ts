import { PrismaClient } from '@prisma/client';
import { seedUsers } from './users';
import { seedWorkspaces } from './workspaces';
import { seedClients } from './clients';
import { seedPatrols } from './patrols';
import { seedIncidents } from './incidents';
import { seedSessions } from './sessions';
import { seedOAuthAccounts } from './oauth-accounts';
import { seedStorage } from './storage';
import { seedResourceMembers } from './resource-members';
import { trackSeedExecution } from './seed-executions';

const logSection = (title: string) =>
  console.log(`\n📎 ${title} ${'='.repeat(50 - title.length)}`);
const logStart = (message: string) => console.log(`\n▶️  ${message}`);
const logSuccess = (message: string) => console.log(`✅ ${message}`);
const logError = (message: string, error: any) =>
  console.error(`❌ ${message}`, error);

export const seed = async (prisma: PrismaClient) => {
  const seedExecution = await trackSeedExecution(prisma, {
    seedName: 'full-database-seed',
    metadata: { startedAt: new Date() }
  });

  try {
    logSection('DATABASE SEEDING START');

    // Core user data
    logSection('CORE USER DATA');

    logStart('Seeding users...');
    const users = await seedUsers(prisma);
    logSuccess(`Created ${users.length} users`);

    logStart('Seeding sessions...');
    await seedSessions(prisma, { users });
    logSuccess('Sessions created');

    logStart('Seeding OAuth accounts...');
    await seedOAuthAccounts(prisma, { users });
    logSuccess('OAuth accounts created');

    logStart('Seeding storage...');
    await seedStorage(prisma, { users });
    logSuccess('Storage seeded');

    // Organization structure
    logSection('ORGANIZATION STRUCTURE');

    logStart('Seeding workspaces...');
    const workspaces = await seedWorkspaces(prisma, {
      count: 5,
      owner: users[0]
    });
    logSuccess(`Created ${workspaces.length} workspaces`);

    logStart('Seeding clients...');
    const clients = await seedClients(prisma, { workspaces, count: 15 });
    logSuccess(`Created ${clients.length} clients`);

    logStart('Seeding patrols...');
    const patrols = await seedPatrols(prisma, { clients, count: 30 });
    logSuccess(`Created ${patrols.length} patrols`);

    // Resource Members
    logSection('RESOURCE MEMBERS');

    logStart('Seeding resource members...');
    await seedResourceMembers(prisma, { users, workspaces, clients, patrols });
    logSuccess('Resource members seeded');

    // Incidents
    logSection('INCIDENTS');

    logStart('Seeding incidents...');
    await seedIncidents(prisma, {
      patrols,
      users,
      count: 50
    });
    logSuccess('Incidents seeded');

    logSection('DATABASE SEEDING COMPLETE');
    await seedExecution.complete();
  } catch (error) {
    logError('Error seeding database:', error);
    await seedExecution.complete(error as Error);
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
