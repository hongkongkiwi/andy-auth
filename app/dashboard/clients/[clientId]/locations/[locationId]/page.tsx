import { notFound } from 'next/navigation';
import { type Metadata } from 'next';
import { db } from '@/constants/mock-api/db';
import PageContainer from '@/components/layout/PageContainer';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Building } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageProps {
  params: {
    clientId: string;
    locationId: string;
  };
}

export const metadata: Metadata = {
  title: 'Location Details',
  description: 'View and manage patrol location details'
};

const Page = async ({ params }: PageProps) => {
  const [client, location] = await Promise.all([
    db.client.findUnique({ where: { id: params.clientId } }),
    db.location.findUnique({ where: { id: params.locationId } })
  ]);

  if (!client || !location || location.client.id !== client.id) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/dashboard/clients/${client.id}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                <Building2 className="mr-2 inline-block h-4 w-4" />
                {client.name}
              </Link>
              <Heading
                title={location.name}
                description="Patrol location details and information"
              />
            </div>
            <Badge
              variant={location.status === 'active' ? 'default' : 'destructive'}
            >
              {location.status}
            </Badge>
          </div>
          <Separator className="my-4" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-1">
                <p className="text-sm">{location.address.street}</p>
                <p className="text-sm">
                  {location.address.city}, {location.address.state}{' '}
                  {location.address.zip}
                </p>
                <p className="text-sm">{location.address.country}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(location.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="grid gap-1">
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(location.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Page;
