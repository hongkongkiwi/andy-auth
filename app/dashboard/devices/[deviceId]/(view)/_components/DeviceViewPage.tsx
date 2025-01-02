'use client';

import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import { db } from '@/constants/mock-api/db';
import { useEffect, useState } from 'react';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import PageContainer from '@/components/layout/PageContainer';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Device } from '@/constants/mock-api/types';
import { DeviceTable } from '../../../(list)/_components/DeviceTable';

interface DeviceViewPageProps {
  deviceId: string;
}

const DeviceViewPage = ({ deviceId }: DeviceViewPageProps) => {
  const { selectedWorkspace } = useWorkspace();
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDevice = async () => {
      if (!selectedWorkspace) {
        setDevice(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await db.device.findFirst({
          where: {
            id: deviceId,
            workspaceId: selectedWorkspace.id
          }
        });
        setDevice(response);
      } catch (error) {
        console.error('Failed to fetch device:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevice();
  }, [deviceId, selectedWorkspace]);

  if (isLoading) return <LoadingSkeleton />;
  if (!device) return <div>Device not found</div>;

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Heading title={device.name} description="View device details" />
      </div>
      <Separator className="my-4" />
      <DeviceTable data={[device]} totalData={1} />
    </PageContainer>
  );
};

export default DeviceViewPage;
