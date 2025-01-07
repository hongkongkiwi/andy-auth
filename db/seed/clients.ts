import { PrismaClient, EntityStatus, Client, Workspace } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';

interface SeedClientsParams {
  workspaces: Workspace[];
  count: number;
}

const generateSettings = (): Prisma.JsonValue => ({
  theme: faker.helpers.arrayElement(['light', 'dark', 'system']),
  locale: 'en-US',
  timezone: 'UTC',
  dateFormat: 'YYYY-MM-DD',
  tablePageSize: faker.number.int({ min: 10, max: 100 }),
  navigationCollapsed: false,
  navigationFavorites: []
});

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
          status: EntityStatus.ACTIVE,
          settings: generateSettings() as Prisma.InputJsonValue,
          address: generateAddress() as Prisma.InputJsonValue,
          workspaceId: workspace.id,
          maxPatrols: faker.number.int({
            min: 1,
            max: 10
          })
        }
      });

      clients.push(client);
      return client;
    })
  );

  return clients;
};
