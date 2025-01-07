import { PrismaClient, User, ObjectStorageFile, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

interface SeedStorageParams {
  users: User[];
}

export const seedStorage = async (
  prisma: PrismaClient,
  { users }: SeedStorageParams
): Promise<ObjectStorageFile[]> => {
  const files: ObjectStorageFile[] = [];

  await Promise.all(
    users.map(async (user) => {
      if (faker.datatype.boolean()) {
        const file = await prisma.objectStorageFile.create({
          data: {
            id: createId(),
            objectKey: `profile-pictures/${user.id}.jpg`,
            objectBucket: 'user-content',
            sizeInBytes: faker.number.int({ min: 1024, max: 5242880 }),
            mimeType: 'image/jpeg',
            metadata: {
              width: 512,
              height: 512,
              originalName: 'profile.jpg',
              thumbnailUrl: faker.image.avatar()
            } as Prisma.InputJsonValue,
            profilePictureUser: {
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
