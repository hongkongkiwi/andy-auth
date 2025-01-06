import { useCallback, useRef } from 'react';
import { PermissionType } from '@prisma/client';
import { usePermissions } from './usePermissions';

interface CachedPermission {
  result: boolean;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useCachedPermissions = () => {
  const { checkPermission } = usePermissions();
  const cache = useRef<Record<string, CachedPermission>>({});

  const getCacheKey = (type: PermissionType, resourceId?: string) => {
    return resourceId ? `${type}_${resourceId}` : type;
  };

  const checkCachedPermission = useCallback(
    async (type: PermissionType, resourceId?: string) => {
      const key = getCacheKey(type, resourceId);
      const cached = cache.current[key];

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.result;
      }

      const result = await checkPermission(type, resourceId);
      cache.current[key] = {
        result,
        timestamp: Date.now()
      };

      return result;
    },
    [checkPermission]
  );

  const clearCache = useCallback(() => {
    cache.current = {};
  }, []);

  return {
    checkCachedPermission,
    clearCache
  };
};
