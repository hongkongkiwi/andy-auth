'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { Guard } from '@/constants/mock-api/types';
import { columns } from './columns';
import { STATUS_OPTIONS } from './useGuardTableFilters';
import { useRouter } from 'next/navigation';
import { useGuardTableFilters } from './useGuardTableFilters';

interface GuardTableProps {
  data: Guard[];
  totalData?: number;
}

const GuardTable = ({ data, totalData = data.length }: GuardTableProps) => {
  const router = useRouter();
  const {
    statusFilter,
    setStatusFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useGuardTableFilters();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleRowClick = (guard: Guard) => {
    router.push(`/dashboard/guards/${guard.id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
        <DataTableFilterBox
          filterKey="status"
          title="Status"
          options={STATUS_OPTIONS}
          setFilterValue={setStatusFilter}
          filterValue={statusFilter}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable
        columns={columns}
        data={data}
        pageCount={Math.ceil(totalData / 10)}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default GuardTable;
