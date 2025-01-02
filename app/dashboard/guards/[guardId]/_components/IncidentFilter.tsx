'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter as FilterIcon, X } from 'lucide-react';

export type Filter = {
  type: 'status' | 'source';
  value: string;
};

interface IncidentFilterProps {
  onFilterChange: (filters: Filter[]) => void;
  showActiveBadges?: boolean;
}

const STATUS_OPTIONS = [
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' }
];

const SOURCE_OPTIONS = [
  { label: 'AI Generated', value: 'ai_generated' },
  { label: 'Guard Report', value: 'guard_report' }
];

export const IncidentFilter = ({
  onFilterChange,
  showActiveBadges = true
}: IncidentFilterProps) => {
  const [selectedFilters, setSelectedFilters] = React.useState<Filter[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFilterChange = React.useCallback(
    (type: Filter['type'], value: string, checked: boolean) => {
      setSelectedFilters((prev) => {
        const newFilters = checked
          ? [...prev, { type, value }]
          : prev.filter((f) => !(f.type === type && f.value === value));

        onFilterChange(newFilters);
        return newFilters;
      });
    },
    [onFilterChange]
  );

  const clearFilters = React.useCallback(() => {
    setSelectedFilters([]);
    onFilterChange([]);
  }, [onFilterChange]);

  const isSelected = React.useCallback(
    (type: Filter['type'], value: string) => {
      return selectedFilters.some((f) => f.type === type && f.value === value);
    },
    [selectedFilters]
  );

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <FilterIcon className="mr-2 h-4 w-4" />
            Filters
            {selectedFilters.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedFilters.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <div className="p-2">
            {STATUS_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={isSelected('status', option.value)}
                  onCheckedChange={(checked) =>
                    handleFilterChange(
                      'status',
                      option.value,
                      checked as boolean
                    )
                  }
                />
                <label
                  htmlFor={`status-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Source</DropdownMenuLabel>
          <div className="p-2">
            {SOURCE_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`source-${option.value}`}
                  checked={isSelected('source', option.value)}
                  onCheckedChange={(checked) =>
                    handleFilterChange(
                      'source',
                      option.value,
                      checked as boolean
                    )
                  }
                />
                <label
                  htmlFor={`source-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {showActiveBadges && selectedFilters.length > 0 && (
        <>
          {selectedFilters.map((filter, index) => (
            <Badge
              key={`${filter.type}-${filter.value}-${index}`}
              variant="secondary"
              className="gap-1"
            >
              {filter.value.replace('_', ' ')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  handleFilterChange(filter.type, filter.value, false)
                }
              />
            </Badge>
          ))}
          {selectedFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          )}
        </>
      )}
    </div>
  );
};
