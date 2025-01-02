'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { IncidentFilter } from './IncidentFilter';
import type { Filter } from './IncidentFilter';
import { db } from '@/constants/mock-api/db';

export type FilterType = 'status' | 'priority';

interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  guardId: string;
  clientId: string;
  locationId?: string;
  createdAt: string;
  updatedAt: string;
}

type SortField = 'date' | 'status';
type SortDirection = 'asc' | 'desc';

const IncidentsTab = ({ guardId }: { guardId: string }) => {
  const [incidents, setIncidents] = React.useState<Incident[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<Filter[]>([]);
  const [sortField, setSortField] = React.useState<SortField>('date');
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('desc');
  const [selectedIncident, setSelectedIncident] =
    React.useState<Incident | null>(null);
  const { ref, inView } = useInView();

  React.useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await db.incident.findMany({
          where: {
            clientId: guardId
          }
        });
        if (response && response.incidents) {
          setIncidents(response.incidents);
        }
      } catch (error) {
        console.error('Failed to fetch incidents:', error);
      }
    };

    fetchIncidents();
  }, [guardId]);

  // Filter and sort incidents
  const filteredIncidents = React.useMemo(() => {
    let result = [...incidents];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (incident) =>
          incident.title.toLowerCase().includes(query) ||
          incident.description.toLowerCase().includes(query)
      );
    }

    // Apply filters
    filters.forEach((filter) => {
      switch (filter.type as FilterType) {
        case 'status':
          result = result.filter(
            (incident) => incident.status === filter.value
          );
          break;
        case 'priority':
          result = result.filter(
            (incident) => incident.priority === filter.value
          );
          break;
      }
    });

    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? parseISO(a.createdAt).getTime() - parseISO(b.createdAt).getTime()
          : parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime();
      } else if (sortField === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

    return result;
  }, [incidents, searchQuery, filters, sortField, sortDirection]);

  // Handle sort field change
  const handleSortFieldChange = React.useCallback(
    (value: string) => {
      if (value === sortField) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(value as SortField);
        setSortDirection('desc');
      }
    },
    [sortField]
  );

  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <IncidentFilter
              onFilterChange={setFilters}
              showActiveBadges={false}
            />
          </div>
          <Select value={sortField} onValueChange={handleSortFieldChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">
                Date{' '}
                {sortDirection === 'asc' ? (
                  <ChevronUp className="inline h-4 w-4" />
                ) : (
                  <ChevronDown className="inline h-4 w-4" />
                )}
              </SelectItem>
              <SelectItem value="status">
                Status{' '}
                {sortDirection === 'asc' ? (
                  <ChevronUp className="inline h-4 w-4" />
                ) : (
                  <ChevronDown className="inline h-4 w-4" />
                )}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredIncidents.map((incident) => (
            <Card
              key={incident.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => setSelectedIncident(incident)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="truncate font-medium">{incident.title}</h3>
                      <Badge variant="outline" className="bg-muted/50">
                        {incident.status}
                      </Badge>
                      <Badge variant="secondary" className="bg-muted/50">
                        {incident.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{format(parseISO(incident.createdAt), 'PPp')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div ref={ref} />
        </div>
      </div>
    </div>
  );
};

export default IncidentsTab;
