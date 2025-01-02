import type { PrismaClient, Client, Workspace } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { SeedOptions, DEFAULT_COUNTS, GeneratedAddress } from './types';

const generateClientName = (): string => {
  const industries = [
    'Security Services',
    'IT Solutions',
    'Manufacturing',
    'Healthcare',
    'Retail',
    'Financial Services',
    'Property Management',
    'Logistics',
    'Education',
    'Hospitality'
  ];
  const patterns = [
    () => `${faker.company.name()} ${faker.helpers.arrayElement(industries)}`,
    () =>
      `${faker.person.lastName()} ${faker.helpers.arrayElement(industries)}`,
    () => `${faker.location.city()} ${faker.helpers.arrayElement(industries)}`,
    () =>
      `${faker.company.buzzAdjective()} ${faker.helpers.arrayElement(industries)}`,
    () =>
      `${faker.person.lastName()} & ${faker.person.lastName()} ${faker.helpers.arrayElement(industries)}`,
    () => `${faker.location.state()} ${faker.helpers.arrayElement(industries)}`
  ];

  return faker.helpers.arrayElement(patterns)();
};

const generateAddress = (): Record<string, any> => ({
  placeId: faker.string.uuid(),
  formattedAddress: faker.location.streetAddress(true),
  latitude: Number(faker.location.latitude()),
  longitude: Number(faker.location.longitude()),
  streetNumber: faker.location.buildingNumber(),
  route: faker.location.street(),
  locality: faker.location.city(),
  administrativeAreaLevel1: faker.location.state(),
  country: faker.location.country(),
  postalCode: faker.location.zipCode()
});

const generateUniqueSlug = (displayName: string): string => {
  return `${faker.helpers.slugify(displayName).toLowerCase()}-${faker.string.alphanumeric(6)}`;
};

export const seedClients = async (
  prisma: PrismaClient,
  workspaces: Workspace[],
  options: SeedOptions = {}
): Promise<Client[]> => {
  const clientsPerWorkspace =
    options.clientsPerWorkspace ?? DEFAULT_COUNTS.clientsPerWorkspace;
  const locationsPerClient =
    options.locationsPerClient ?? DEFAULT_COUNTS.locationsPerClient;
  const clients: Client[] = [];

  for (const workspace of workspaces) {
    await Promise.all(
      Array.from({ length: clientsPerWorkspace }, async () => {
        const displayName = generateClientName();
        const client = await prisma.client.create({
          data: {
            displayName,
            companyName: faker.company.name(),
            slug: generateUniqueSlug(displayName),
            clientEmail: faker.internet.email().toLowerCase(),
            clientWebsite: faker.internet.url(),
            clientPhoneNumber: `+${faker.string.numeric(11)}`,
            notes: faker.lorem.paragraph(),
            imageUrl: faker.image.url(),
            address: generateAddress() as any,
            workspaceId: workspace.id,
            locations: {
              create: Array.from({ length: locationsPerClient }, () => {
                const locationAddress = generateAddress();
                return {
                  displayName: faker.location.streetAddress(),
                  slug: faker.helpers
                    .slugify(faker.location.streetAddress())
                    .toLowerCase(),
                  locationType: faker.helpers.arrayElement([
                    'OFFICE',
                    'WAREHOUSE',
                    'RETAIL',
                    'RESIDENTIAL'
                  ]),
                  address: locationAddress as any,
                  timezone: workspace.timezone ?? 'UTC',
                  workspace: {
                    connect: {
                      id: workspace.id
                    }
                  }
                };
              })
            }
          }
        });
        clients.push(client);
        return client;
      })
    );
  }

  return clients;
};
