'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Maintenance' }
];

export const TYPE_OPTIONS = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'beacon', label: 'Beacon' },
  { value: 'camera', label: 'Camera' }
];

export const useDeviceTableFilters = () => {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [typeFilter, setTypeFilter] = useQueryState(
    'type',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    'status',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setTypeFilter(null);
    setStatusFilter(null);
    setPage(1);
  }, [setSearchQuery, setTypeFilter, setStatusFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!typeFilter || !!statusFilter;
  }, [searchQuery, typeFilter, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
};
