import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    clientId: string;
  };
}

export default function ClientPage({ params }: PageProps) {
  redirect(`/dashboard/clients/${params.clientId}/overview`);
}
