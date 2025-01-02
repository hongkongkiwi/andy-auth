'use client';

import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import { db } from '@/constants/mock-api/db';
import { useEffect, useState } from 'react';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import PageContainer from '@/components/layout/PageContainer';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import type { Device } from '@/constants/mock-api/types';
import { DeviceTable } from './DeviceTable';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const DeviceListingPage = () => {
  const router = useRouter();
  const { selectedWorkspace } = useWorkspace();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchDevices = async () => {
      if (!selectedWorkspace) {
        setDevices([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await db.device.findMany({
          where: {
            workspaceId: selectedWorkspace.id,
            ...(searchParams.get('q') && {
              name: { contains: searchParams.get('q') || '' }
            }),
            ...(searchParams.get('type') && {
              type: searchParams.get('type') as Device['type']
            }),
            ...(searchParams.get('status') && {
              status: searchParams.get('status') as Device['status']
            })
          }
        });
        setDevices(response);
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [selectedWorkspace, searchParams]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Heading
          title="Devices"
          description="Manage your devices and their assignments"
        />
        <Button onClick={() => router.push('/dashboard/devices/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Device
        </Button>
      </div>
      <Separator className="my-4" />
      <DeviceTable data={devices} totalData={devices.length} />
    </PageContainer>
  );
};

export default DeviceListingPage;
