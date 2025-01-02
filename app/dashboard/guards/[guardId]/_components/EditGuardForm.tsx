'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { type Guard, fakeGuards } from '@/constants/mock-api';

const EditGuardForm = ({ guardId }: { guardId: string }) => {
  const router = useRouter();
  const [guardData, setGuardData] = React.useState<Guard | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [newCertification, setNewCertification] = React.useState('');

  React.useEffect(() => {
    const loadGuard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fakeGuards.getGuard(guardId);
        if (!response.guard) {
          setError(`Guard with ID ${guardId} not found`);
          return;
        }
        setGuardData(response.guard);
      } catch (error) {
        console.error('Failed to load guard:', error);
        setError('Failed to load guard details');
      } finally {
        setIsLoading(false);
      }
    };

    loadGuard();
  }, [guardId]);

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

  const addCertification = () => {
    if (!newCertification.trim() || !guardData) return;

    setGuardData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        metrics: {
          ...prev.metrics,
          certifications: [
            ...prev.metrics.certifications,
            newCertification.trim()
          ]
        }
      };
    });
    setNewCertification('');
  };

  const removeCertification = (index: number) => {
    if (!guardData) return;

    setGuardData((prev) => {
      if (!prev) return prev;
      const newCertifications = [...prev.metrics.certifications];
      newCertifications.splice(index, 1);
      return {
        ...prev,
        metrics: {
          ...prev.metrics,
          certifications: newCertifications
        }
      };
    });
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
                    onChange={(e) =>
                      setGuardData((prev) =>
                        prev ? { ...prev, name: e.target.value } : prev
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Gender</label>
                  <Select
                    value={guardData.gender}
                    onValueChange={(value) =>
                      setGuardData((prev) =>
                        prev
                          ? { ...prev, gender: value as Guard['gender'] }
                          : prev
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Status</label>
                  <Select
                    value={guardData.status}
                    onValueChange={(value) =>
                      setGuardData((prev) =>
                        prev
                          ? { ...prev, status: value as Guard['status'] }
                          : prev
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Contact Information</h3>
                <div className="space-y-2">
                  <label className="text-sm">Phone</label>
                  <Input
                    value={guardData.phone}
                    onChange={(e) =>
                      setGuardData((prev) =>
                        prev ? { ...prev, phone: e.target.value } : prev
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Email</label>
                  <Input
                    type="email"
                    value={guardData.email}
                    onChange={(e) =>
                      setGuardData((prev) =>
                        prev ? { ...prev, email: e.target.value } : prev
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Address</label>
                  <Input
                    value={guardData.addressLine1 || ''}
                    onChange={(e) =>
                      setGuardData((prev) =>
                        prev ? { ...prev, addressLine1: e.target.value } : prev
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add new certification"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCertification();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addCertification}
                variant="outline"
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {guardData.metrics.certifications.map((cert, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1"
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
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
