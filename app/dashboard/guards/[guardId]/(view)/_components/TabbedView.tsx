'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Guard } from '@/constants/mock-api/types';
import { Breadcrumbs } from '../../_components/Breadcrumbs';
import IncidentsTab from '../../_components/IncidentsTab';

interface TabbedViewProps {
  guardId: string;
  guard: Guard;
}

export default function TabbedView({ guardId, guard }: TabbedViewProps) {
  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="overview" className="flex h-full flex-col">
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
                <CardHeader>
                  <CardTitle>Guard Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold">
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-muted-foreground">
                            Name
                          </label>
                          <p className="text-base">{guard.name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">
                            Email
                          </label>
                          <p className="text-base">{guard.email}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">
                            Phone
                          </label>
                          <p className="text-base">{guard.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">
                            Status
                          </label>
                          <Badge variant="outline" className="mt-1">
                            {guard.status}
                          </Badge>
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
                            <p className="text-2xl font-bold">0</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/50">
                          <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">
                              Hours
                            </p>
                            <p className="text-2xl font-bold">0</p>
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
}
