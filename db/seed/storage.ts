import { PrismaClient, ObjectStorageFile, PlatformUser } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

interface SeedStorageParams {
  platformUsers: PlatformUser[];
}

export const seedStorage = async (
  prisma: PrismaClient,
  { platformUsers }: SeedStorageParams
): Promise<ObjectStorageFile[]> => {
  const files: ObjectStorageFile[] = [];

  await Promise.all(
    platformUsers.map(async (user) => {
      if (faker.datatype.boolean()) {
        const file = await prisma.objectStorageFile.create({
          data: {
            id: createId(),
            objectKey: `profile-pictures/${user.id}.jpg`,
            objectBucket: 'user-content',
            sizeInBytes: faker.number.int({ min: 1024, max: 5242880 }), // Changed from size
            mimeType: 'image/jpeg',
            metadata: {
              width: 512,
              height: 512,
              originalName: 'profile.jpg'
            },
            profilePicture: {
              connect: { id: user.id }
            }
          }
        });
        files.push(file);
      }
    })
  );

  return files;
};
