import { PrismaClient, Location, Client } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

interface SeedLocationsParams {
  clients: Client[];
  count: number;
}

const generateAddress = () => ({
  placeId: createId(),
  formattedAddress: faker.location.streetAddress(true),
  latitude: Number(faker.location.latitude()),
  longitude: Number(faker.location.longitude()),
  raw: null
});

export const seedLocations = async (
  prisma: PrismaClient,
  { clients, count }: SeedLocationsParams
): Promise<Location[]> => {
  const locations: Location[] = [];

  await Promise.all(
    Array.from({ length: count }, async () => {
      const client = faker.helpers.arrayElement(clients);

      const location = await prisma.location.create({
        data: {
          id: createId(),
          name: faker.company.name(),
          description: faker.company.catchPhrase(),
          status: 'ACTIVE',
          address: generateAddress(),
          clientId: client.id
        }
      });

      locations.push(location);
      return location;
    })
  );

  return locations;
};
