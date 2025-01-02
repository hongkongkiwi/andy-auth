'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' }
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

export const useIncidentTableFilters = () => {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    'status',
    searchParams.status.withOptions({ shallow: false }).withDefault('')
  );

  const [priorityFilter, setPriorityFilter] = useQueryState(
    'priority',
    searchParams.priority.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);
    setPriorityFilter(null);
    setPage(1);
  }, [setSearchQuery, setStatusFilter, setPriorityFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!statusFilter || !!priorityFilter;
  }, [searchQuery, statusFilter, priorityFilter]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
};
