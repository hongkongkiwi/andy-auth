import { Metadata } from 'next';
import ClientLocationViewPage from './_components/ClientLocationViewPage';

export const metadata: Metadata = {
  title: 'Dashboard : Client Location View'
};

const Page = () => {
  return <ClientLocationViewPage />;
};

export default Page;
