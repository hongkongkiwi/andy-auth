'use client';

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

export function useIncidentTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState('q');
  const [statusFilter, setStatusFilter] = useQueryState('status');
  const [priorityFilter, setPriorityFilter] = useQueryState('priority');
  const [page, setPage] = useQueryState('page');

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);
    setPriorityFilter(null);
    setPage(null);
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
}
