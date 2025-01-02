'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { type Guard } from '@/constants/mock-api/types';
import { Breadcrumbs } from './Breadcrumbs';
import IncidentsTab from './IncidentsTab';

interface TabbedViewProps {
  guardId: string;
  guard: Guard;
}

const TabbedView = ({ guardId, guard }: TabbedViewProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = React.useState(
    searchParams?.get('tab') || 'overview'
  );

  const handleTabChange = React.useCallback(
    (value: string) => {
      setActiveTab(value);
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      newSearchParams.set('tab', value);
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="flex h-full flex-col">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex h-full flex-col"
      >
        <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Breadcrumbs guard={guard} />
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="incidents">Incidents</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/guards/${guardId}/edit`}>
                  Edit Details
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="overview" className="mt-0 h-full">
            <div className="container py-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold">Details</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{guard.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Status
                          </p>
                          <Badge variant="outline">{guard.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-4 text-lg font-semibold">Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-muted/50">
                          <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">
                              Incidents
                            </p>
                            <p className="text-2xl font-bold">
                              {guard.metrics?.incidents || 0}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/50">
                          <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">
                              Hours
                            </p>
                            <p className="text-2xl font-bold">
                              {guard.metrics?.hours || 0}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="mt-0 h-full">
            <IncidentsTab guardId={guardId} />
          </TabsContent>

          <TabsContent value="schedule" className="mt-0 h-full">
            <div className="container py-6">
              Schedule content coming soon...
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0 h-full">
            <div className="container py-6">
              Settings content coming soon...
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TabbedView;
