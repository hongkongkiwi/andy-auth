'use client';

import { useQueryState, parseAsString } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
] as const;

type StatusOption = (typeof STATUS_OPTIONS)[number]['value'];

export const useClientTableFilters = () => {
  const [searchQuery, setSearchQuery] = useQueryState('q', parseAsString);
  const [statusFilter, setStatusFilter] = useQueryState(
    'status',
    parseAsString
  );
  const [page, setPage] = useQueryState('page', parseAsString);

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);
    setPage(null);
  }, [setSearchQuery, setStatusFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!statusFilter;
  }, [searchQuery, statusFilter]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(String(newPage));
    },
    [setPage]
  );

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage: handlePageChange,
    resetFilters,
    isAnyFilterActive
  };
};
