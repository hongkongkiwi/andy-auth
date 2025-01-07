import {
  PrismaClient,
  OAuthProvider,
  User,
  OAuthAccount
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

interface SeedOAuthAccountsParams {
  users: User[];
}

export const seedOAuthAccounts = async (
  prisma: PrismaClient,
  { users }: SeedOAuthAccountsParams
): Promise<OAuthAccount[]> => {
  const accounts: OAuthAccount[] = [];

  await Promise.all(
    users.map(async (user) => {
      if (faker.datatype.boolean()) {
        const provider = faker.helpers.arrayElement(
          Object.values(OAuthProvider)
        );

        const account = await prisma.oAuthAccount.create({
          data: {
            id: createId(),
            userId: user.id,
            provider,
            providerAccountId: faker.string.uuid(),
            accessToken: createId(),
            refreshToken: createId(),
            expiresAt: faker.date.future(),
            scope: 'email profile',
            idToken: createId(),
            sessionState: null
          }
        });

        accounts.push(account);
      }
    })
  );

  return accounts;
};
