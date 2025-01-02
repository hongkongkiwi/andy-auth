'use client';

import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/PageContainer';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClient } from '@/components/layout/ClientSwitcher/hooks/useClient';
import { db } from '@/constants/mock-api/db';
import type { Client } from '@/constants/mock-api/types';

interface PageProps {
  params: {
    clientId: string;
  };
}

export default function ClientSettingsPage({ params }: PageProps) {
  const { selectedClient, handleClientSwitch } = useClient();

  useEffect(() => {
    const loadClient = async () => {
      const client = await db.client.findUnique({
        where: { id: params.clientId }
      });
      if (!client) {
        notFound();
      }
      if (!selectedClient || selectedClient.id !== client.id) {
        handleClientSwitch(client);
      }
    };

    loadClient();
  }, [params.clientId, selectedClient, handleClientSwitch]);

  if (!selectedClient) {
    return null;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <Heading
            title={`${selectedClient.name} - Settings`}
            description="Manage client settings and preferences"
          />
          <Separator className="my-4" />
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Configure general client settings and information.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Configure security settings and access controls.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Configure notification settings and alerts.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Manage third-party integrations and connections.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
