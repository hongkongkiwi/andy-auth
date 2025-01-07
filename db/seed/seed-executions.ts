import { PrismaClient, SeedExecutionStatus, Prisma } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';

interface TrackSeedExecutionParams {
  seedName: string;
  metadata?: Record<string, unknown>;
}

export const trackSeedExecution = async (
  prisma: PrismaClient,
  { seedName, metadata }: TrackSeedExecutionParams
) => {
  const execution = await prisma.seedExecution.create({
    data: {
      id: createId(),
      seedName,
      status: SeedExecutionStatus.RUNNING,
      executedAt: new Date(),
      metadata: metadata ? (metadata as Prisma.InputJsonValue) : Prisma.JsonNull
    }
  });

  return {
    complete: async (error?: Error) => {
      await prisma.seedExecution.update({
        where: { id: execution.id },
        data: {
          status: error
            ? SeedExecutionStatus.FAILED
            : SeedExecutionStatus.COMPLETED,
          completedAt: new Date(),
          error: error?.message
        }
      });
    }
  };
};
