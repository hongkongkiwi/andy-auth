import { useCallback } from 'react';
import { usePermissions } from './usePermissions';
import { getProtectedDb } from '@/lib/db';
import type { Prisma, PrismaClient } from '@prisma/client';
import type { PermissionResult, ModelName } from '../types/permissions';

export const useModel = <T extends ModelName>(modelName: T) => {
  const { check } = usePermissions();

  const create = useCallback(
    async <TData>(data: TData) => {
      const permission = await check({
        model: modelName,
        operation: 'create',
        data: data as Record<string, unknown>
      });

      if (!permission.granted) {
        return { permission };
      }

      const db = await getProtectedDb();
      const result = await (db[modelName] as any).create({ data });
      return { result, permission };
    },
    [modelName, check]
  );

  const update = useCallback(
    async <TData, TWhere>(where: TWhere, data: TData) => {
      const permission = await check({
        model: modelName,
        operation: 'update',
        data: { ...where, ...data } as Record<string, unknown>
      });

      if (!permission.granted) {
        return { permission };
      }

      const db = await getProtectedDb();
      const result = await (db[modelName] as any).update({ where, data });
      return { result, permission };
    },
    [modelName, check]
  );

  const remove = useCallback(
    async <TWhere>(where: TWhere) => {
      const permission = await check({
        model: modelName,
        operation: 'delete',
        data: where as Record<string, unknown>
      });

      if (!permission.granted) {
        return { permission };
      }

      const db = await getProtectedDb();
      const result = await (db[modelName] as any).delete({ where });
      return { result, permission };
    },
    [modelName, check]
  );

  const findMany = useCallback(
    async (params: Prisma.Args<any, 'findMany'>) => {
      const permission = await check({
        model: modelName,
        operation: 'read',
        data: (params.where || {}) as Record<string, unknown>
      });

      if (!permission.granted) {
        return { permission };
      }

      const db = await getProtectedDb();
      const result = await (db[modelName] as any).findMany(params);
      return { result, permission };
    },
    [modelName, check]
  );

  return {
    create,
    update,
    remove,
    findMany
  };
};
