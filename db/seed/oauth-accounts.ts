import {
  PrismaClient,
  OAuthProvider,
  PlatformUser,
  OAuthAccount
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

interface SeedOAuthAccountsParams {
  platformUsers: PlatformUser[];
}

export const seedOAuthAccounts = async (
  prisma: PrismaClient,
  { platformUsers }: SeedOAuthAccountsParams
): Promise<OAuthAccount[]> => {
  const accounts: OAuthAccount[] = [];

  await Promise.all(
    platformUsers.map(async (user) => {
      if (faker.datatype.boolean()) {
        const provider = faker.helpers.arrayElement(
          Object.values(OAuthProvider)
        );

        const account = await prisma.oAuthAccount.create({
          data: {
            userId: user.id,
            provider,
            providerAccountId: faker.string.uuid(),
            accessToken: createId(),
            refreshToken: createId(),
            expiresAt: faker.date.future(),
            tokenType: 'Bearer',
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
