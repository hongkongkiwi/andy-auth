import { Metadata } from 'next';
import EditGuardForm from '../_components/EditGuardForm';

export const metadata: Metadata = {
  title: 'Dashboard : Edit Guard'
};

interface PageProps {
  params: {
    guardId: string;
  };
}

const Page = ({ params }: PageProps) => {
  return <EditGuardForm guardId={params.guardId} />;
};

export default Page;
