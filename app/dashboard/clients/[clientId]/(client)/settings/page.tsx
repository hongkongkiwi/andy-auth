import { notFound } from 'next/navigation';
import { type Metadata } from 'next';
import { db } from '@/constants/mock-api/db';
import PageContainer from '@/components/layout/PageContainer';
import ClientForm from '@/app/dashboard/clients/(list)/_components/ClientForm';

interface PageProps {
  params: {
    clientId: string;
  };
}

export const metadata: Metadata = {
  title: 'Client Settings',
  description: 'View and manage client settings'
};

export default async function Page({ params }: PageProps) {
  const client = await db.client.findUnique({ where: { id: params.clientId } });

  if (!client) {
    notFound();
  }

  return (
    <PageContainer>
      <ClientForm initialData={client} />
    </PageContainer>
  );
}
