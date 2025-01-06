import { PrismaClient, Client, Workspace } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

interface SeedClientsParams {
  workspaces: Workspace[];
  count: number;
}

const generateSettings = () => ({
  theme: faker.helpers.arrayElement(['light', 'dark', 'system']),
  table: {
    pageSize: faker.number.int({ min: 10, max: 100 }),
    columnVisibility: {}
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

export const seedClients = async (
  prisma: PrismaClient,
  { workspaces, count }: SeedClientsParams
): Promise<Client[]> => {
  const clients: Client[] = [];

  await Promise.all(
    Array.from({ length: count }, async () => {
      const workspace = faker.helpers.arrayElement(workspaces);

      const client = await prisma.client.create({
        data: {
          id: createId(),
          name: faker.company.name(),
          description: faker.company.catchPhrase(),
          logoUrl: faker.image.urlLoremFlickr({ category: 'business' }),
          status: 'ACTIVE',
          settings: generateSettings(),
          address: generateAddress(),
          workspaceId: workspace.id,
          maxLocations: faker.number.int({
            min: 1,
            max: workspace.maxLocationsPerClient ?? 10
          })
        }
      });

      clients.push(client);
      return client;
    })
  );

  return clients;
};
