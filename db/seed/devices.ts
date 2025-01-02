import type { PrismaClient, Device, Workspace, Client } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { DeviceType, DeviceStatus } from '@prisma/client';
import { SeedOptions, DEFAULT_COUNTS } from './types';

interface SeedDevicesParams {
  workspaces: Workspace[];
  clients: Client[];
  options?: SeedOptions;
}

// Update device models to match our schema
const deviceModels = {
  [DeviceType.BODY_CAMERA]: [
    'Axon Body 3',
    'Motorola V300',
    'Panasonic BWC',
    'Getac BC-02',
    'WatchGuard V300'
  ],
  [DeviceType.MOBILE]: [
    'iPhone 15 Pro',
    'Samsung Galaxy S23',
    'Google Pixel 8',
    'OnePlus 11'
  ],
  [DeviceType.UNKNOWN]: ['Generic Device', 'Other Device', 'Custom Device']
};

export const seedDevices = async (
  prisma: PrismaClient,
  { workspaces, clients }: SeedDevicesParams,
  options: SeedOptions = {}
): Promise<Device[]> => {
  const devicesPerClient =
    options.devicesPerClient ?? DEFAULT_COUNTS.devicesPerClient;
  const devices: Device[] = [];

  for (const workspace of workspaces) {
    const workspaceClients = clients.filter(
      (c) => c.workspaceId === workspace.id
    );

    for (const client of workspaceClients) {
      const clientDevices = await Promise.all(
        Array.from({ length: devicesPerClient }, async () => {
          const type = faker.helpers.arrayElement(Object.values(DeviceType));
          const model = faker.helpers.arrayElement(deviceModels[type]);
          const device = await prisma.device.create({
            data: {
              deviceName: `${faker.company.name()} Device`,
              deviceModel: model,
              serialNumber: faker.string.alphanumeric(10).toUpperCase(),
              mqttIotThingName: faker.string.alphanumeric(10),
              mqttIotClientId: faker.string.alphanumeric(10),
              mqttIotShadow: {},
              deviceType: type,
              deviceStatus: DeviceStatus.ACTIVE,
              workspaceId: workspace.id,
              clientId: client.id
            }
          });
          devices.push(device);
          return device;
        })
      );
    }
  }

  return devices;
};
