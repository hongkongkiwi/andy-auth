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
import {
  getProtectedDb,
  batchByIds,
  type BatchResult,
  type RetryFunction
} from '@/lib/db';
import {
  type Incident,
  type IncidentReport,
  type GuardShift
} from '@prisma/client';

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

interface BatchedGuardData {
  incidents: BatchResult<Incident[]>;
  reports: BatchResult<IncidentReport[]>;
  shifts: BatchResult<GuardShift[]>;
}

const fetchGuardData = async (guardId: string): Promise<BatchedGuardData> => {
  const db = await getProtectedDb();

  const errorHandling = {
    onChunkError: (error: Error, chunk: RetryFunction<any>[]) => {
      console.error('Chunk failed:', { error, size: chunk.length });
    },
    onItemError: (error: Error, index: number) => {
      console.error('Item failed:', { error, index });
    },
    throwOnError: false // Continue processing other chunks on error
  };

  const [incidents, reports, shifts] = await Promise.all([
    batchByIds(
      ['open', 'in_progress', 'closed'],
      (status) =>
        db.incident.findMany({
          where: { guardId, status },
          orderBy: { createdAt: 'desc' }
        }),
      {
        chunkSize: 1, // Process each status separately
        errorHandling,
        timeout: 8000 // 8 second timeout per status query
      }
    ),
    batchByIds(
      ['pending', 'approved', 'rejected'],
      (status) =>
        db.incidentReport.findMany({
          where: { guardId, status }
        }),
      {
        chunkSize: 1,
        errorHandling,
        timeout: 8000
      }
    ),
    batchByIds(
      ['current', 'past'],
      (type) =>
        db.guardShift.findMany({
          where: { guardId },
          include: { incidents: true },
          ...(type === 'current'
            ? {
                where: { endTime: { gt: new Date() } }
              }
            : {
                take: 10,
                orderBy: { startTime: 'desc' }
              })
        }),
      {
        chunkSize: 1,
        errorHandling,
        timeout: 8000
      }
    )
  ]);

  // Log any failures
  [incidents, reports, shifts].forEach((result, i) => {
    const type = ['incidents', 'reports', 'shifts'][i];
    if (result.failed.length > 0) {
      console.error(`Failed ${type}:`, result.failed);
    }
  });

  return { incidents, reports, shifts };
};

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
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchGuardData(guardId);
        setIncidents(data.incidents.results.flat());
        // Handle any partial failures
        if (data.incidents.failed.length > 0) {
          console.warn('Some incident data failed to load');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [guardId]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <div>Error loading incidents: {error.message}</div>;

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
