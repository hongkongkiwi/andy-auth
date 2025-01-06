import { PrismaClient, Workspace } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

interface SeedWorkspacesParams {
  count: number;
}

const generateSettings = () => ({
  theme: faker.helpers.arrayElement(['light', 'dark', 'system']),
  table: {
    pageSize: faker.number.int({ min: 10, max: 100 }),
    columnVisibility: {}
  },
  navigation: {
    collapsed: false,
    favorites: [],
    recentItems: []
  },
  notifications: {
    email: true,
    push: true,
    inApp: true
  }
});

const generateAddress = () => ({
  placeId: createId(),
  formattedAddress: faker.location.streetAddress(true),
  latitude: Number(faker.location.latitude()),
  longitude: Number(faker.location.longitude()),
  raw: null
});

export const seedWorkspaces = async (
  prisma: PrismaClient,
  { count }: SeedWorkspacesParams
): Promise<Workspace[]> => {
  const workspaces: Workspace[] = [];

  await Promise.all(
    Array.from({ length: count }, async () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();

      const workspace = await prisma.workspace.create({
        data: {
          id: createId(),
          name,
          slug,
          description: faker.company.catchPhrase(),
          logoUrl: faker.image.urlLoremFlickr({ category: 'business' }),
          status: 'ACTIVE',
          settings: generateSettings(),
          address: generateAddress(),
          maxClients: faker.number.int({ min: 5, max: 50 }),
          maxLocationsPerClient: faker.number.int({ min: 3, max: 20 }),
          features: faker.helpers.arrayElements([
            'incidents',
            'analytics',
            'reports',
            'integrations',
            'api_access'
          ])
        }
      });

      workspaces.push(workspace);
      return workspace;
    })
  );

  return workspaces;
};
