'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { User } from '@/constants/mock-api/types';
import { columns } from './columns';
import {
  STATUS_OPTIONS,
  ROLE_OPTIONS,
  useUserTableFilters
} from './useUserTableFilters';

export default function UserTable({
  data,
  totalData
}: {
  data: User[];
  totalData: number;
}) {
  const {
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useUserTableFilters();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
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
          filterKey="role"
          title="Role"
          options={ROLE_OPTIONS}
          setFilterValue={setRoleFilter}
          filterValue={roleFilter}
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
      />
    </div>
  );
}
