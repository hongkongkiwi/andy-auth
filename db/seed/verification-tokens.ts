import {
  PrismaClient,
  VerificationTokenType,
  AuditLogResourceType,
  AuditLogEventType,
  AuditSeverityLevel,
  Prisma
} from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';
import { faker } from '@faker-js/faker';
import { SeedOptions } from './types';

export const seedVerificationTokens = async (
  prisma: PrismaClient,
  options: SeedOptions = {}
) => {
  await prisma.$transaction(async (tx) => {
    const token = await tx.verificationToken.create({
      data: {
        id: createId(),
        identifier: faker.internet.email().toLowerCase(),
        token: createId(),
        type: VerificationTokenType.EMAIL_VERIFICATION,
        expiresAt: faker.date.future()
      }
    });

    await tx.auditLog.create({
      data: {
        id: createId(),
        resourceId: token.identifier,
        resourceType: AuditLogResourceType.VERIFICATION,
        eventType: AuditLogEventType.CREATE,
        userId: options.seedUserId ?? 'SYSTEM',
        description: 'Created verification token',
        severity: AuditSeverityLevel.INFO,
        success: true,
        metadata: {
          type: token.type,
          expiresAt: token.expiresAt
        } as Prisma.InputJsonValue
      }
    });

    return token;
  });
};
