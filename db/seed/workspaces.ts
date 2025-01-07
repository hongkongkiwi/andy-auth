import {
  Prisma,
  User,
  Workspace,
  PrismaClient,
  EntityStatus,
  Role,
  Permission
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

interface SeedWorkspacesParams {
  count: number;
  owner: User;
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

export const seedWorkspaces = async (
  prisma: PrismaClient,
  { count, owner }: SeedWorkspacesParams
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
          status: EntityStatus.ACTIVE,
          settings: generateSettings() as Prisma.InputJsonValue,
          address: generateAddress() as Prisma.InputJsonValue,
          features: faker.helpers.arrayElements([
            'incidents',
            'analytics',
            'reports',
            'integrations',
            'api_access'
          ]),
          owner: {
            connect: { id: owner.id }
          },
          members: {
            create: {
              id: createId(),
              userId: owner.id,
              role: Role.OWNER,
              permissions: [
                Permission.WORKSPACE_SETTINGS,
                Permission.WORKSPACE_MEMBERS,
                Permission.WORKSPACE_BILLING,
                Permission.WORKSPACE_CLIENTS
              ]
            }
          }
        }
      });

      workspaces.push(workspace);
      return workspace;
    })
  );

  return workspaces;
};
