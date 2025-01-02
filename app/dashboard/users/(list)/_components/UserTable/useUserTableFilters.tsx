'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

export const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'user', label: 'User' }
];

export const useUserTableFilters = () => {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [roleFilter, setRoleFilter] = useQueryState(
    'role',
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
    setRoleFilter(null);
    setStatusFilter(null);
    setPage(1);
  }, [setSearchQuery, setRoleFilter, setStatusFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!roleFilter || !!statusFilter;
  }, [searchQuery, roleFilter, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
};
