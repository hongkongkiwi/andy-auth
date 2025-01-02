import { PrismaClient, Workspace, WorkspaceStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { SeedOptions, DEFAULT_COUNTS } from './types';

const generateCompanyName = () => {
  const patterns = [
    () =>
      `${faker.company.buzzNoun()} ${faker.company.buzzAdjective()} ${faker.company.buzzNoun()}`,
    () => `${faker.person.lastName()} & Associates`,
    () => `${faker.company.name()}`,
    () => `${faker.person.lastName()} ${faker.company.buzzNoun()}`,
    () => `${faker.location.city()} ${faker.company.buzzNoun()}`
  ];

  return faker.helpers.arrayElement(patterns)();
};

export const seedWorkspaces = async (
  prisma: PrismaClient,
  options: SeedOptions = {}
): Promise<Workspace[]> => {
  const workspaceCount =
    options.workspaceCount ?? DEFAULT_COUNTS.workspaceCount;

  return Promise.all(
    Array.from({ length: workspaceCount }, async () => {
      const name = generateCompanyName();
      return prisma.workspace.create({
        data: {
          displayName: name,
          companyName: name,
          slug: faker.helpers.slugify(name).toLowerCase(),
          timezone: faker.helpers.arrayElement([
            'America/New_York',
            'America/Los_Angeles',
            'Europe/London',
            'Asia/Singapore'
          ]),
          companyEmail: faker.internet.email().toLowerCase(),
          companyWebsite: faker.internet.url(),
          companyPhoneNumber: `+${faker.string.numeric(11)}`,
          workspaceStatus: WorkspaceStatus.ACTIVE,
          notes: faker.lorem.paragraph(),
          imageUrl: faker.image.url()
        }
      });
    })
  );
};
