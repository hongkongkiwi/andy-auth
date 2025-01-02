import { notFound } from 'next/navigation';
import { type Metadata } from 'next';
import { db } from '@/constants/mock-api/db';
import type { Client } from '@/constants/mock-api/types';
import PageContainer from '@/components/layout/PageContainer';

interface PageProps {
  params: {
    clientId: string;
  };
}

export const metadata: Metadata = {
  title: 'Client Overview',
  description: 'Overview of client details and information'
};

const Page = async ({ params }: PageProps) => {
  const client = await db.client.findUnique({ where: { id: params.clientId } });

  if (!client) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">{client.name}</h1>
          {client.description && (
            <p className="text-muted-foreground">{client.description}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Contact Information</h3>
            <div className="mt-2 space-y-1">
              <p>Email: {client.email}</p>
              <p>Phone: {client.phone}</p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Address</h3>
            <div className="mt-2 space-y-1">
              <p>{client.address?.street}</p>
              <p>
                {client.address?.city}, {client.address?.state}{' '}
                {client.address?.zip}
              </p>
              <p>{client.address?.country}</p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Account Details</h3>
            <div className="mt-2 space-y-1">
              <p>
                Status: <span className="capitalize">{client.status}</span>
              </p>
              <p>Created: {new Date(client.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Page;
