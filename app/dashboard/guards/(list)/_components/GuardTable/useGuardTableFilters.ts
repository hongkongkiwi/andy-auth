'use client';

import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On Leave' },
  { value: 'suspended', label: 'Suspended' }
];

export function useGuardTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState('q');
  const [statusFilter, setStatusFilter] = useQueryState('status');
  const [page, setPage] = useQueryState('page');

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);
    setPage(null);
  }, [setSearchQuery, setStatusFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!statusFilter;
  }, [searchQuery, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
}
