'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '@/constants/mock-api/db';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import type { Guard } from '@/constants/mock-api/types';

const EditGuardForm = ({ guardId }: { guardId: string }) => {
  const router = useRouter();
  const { selectedWorkspace } = useWorkspace();
  const [guardData, setGuardData] = React.useState<Guard | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadGuard = async () => {
      if (!selectedWorkspace) {
        setError('No workspace selected');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const guard = await db.guard.findFirst({
          where: {
            id: guardId,
            workspaceId: selectedWorkspace.id
          }
        });

        if (!guard) {
          setError(`Guard with ID ${guardId} not found`);
          return;
        }
        setGuardData(guard);
      } catch (error) {
        console.error('Failed to load guard:', error);
        setError('Failed to load guard details');
      } finally {
        setIsLoading(false);
      }
    };

    loadGuard();
  }, [guardId, selectedWorkspace]);

  const handleInputChange = <K extends keyof Guard>(
    field: K,
    value: Guard[K]
  ) => {
    setGuardData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would make an API call to update the guard
      // await updateGuard(guardData);
      router.push(`/dashboard/guards/${guardId}`);
    } catch (error) {
      console.error('Failed to update guard:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!guardData) return <div>Guard not found</div>;

  return (
    <div className="container mx-auto py-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Guard Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Personal Information</h3>
                <div className="space-y-2">
                  <label className="text-sm">Name</label>
                  <Input
                    value={guardData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Status</label>
                  <Input
                    value={guardData.status}
                    onChange={(e) =>
                      handleInputChange(
                        'status',
                        e.target.value as Guard['status']
                      )
                    }
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Contact Information</h3>
                <div className="space-y-2">
                  <label className="text-sm">Phone</label>
                  <Input
                    value={guardData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Email</label>
                  <Input
                    type="email"
                    value={guardData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Address</label>
                  <Input
                    value={guardData.address.street || ''}
                    onChange={(e) =>
                      setGuardData((prev) =>
                        prev
                          ? {
                              ...prev,
                              address: {
                                ...prev.address,
                                street: e.target.value
                              }
                            }
                          : prev
                      )
                    }
                  />
                  <Input
                    value={guardData.address.city || ''}
                    onChange={(e) =>
                      setGuardData((prev) =>
                        prev
                          ? {
                              ...prev,
                              address: { ...prev.address, city: e.target.value }
                            }
                          : prev
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/guards/${guardId}`)}
          >
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default EditGuardForm;
