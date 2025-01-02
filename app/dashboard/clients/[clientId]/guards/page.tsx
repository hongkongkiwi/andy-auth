import ClientLocationListingPage from './_components/ClientLocationListingPage';

interface PageProps {
  searchParams: {
    q?: string;
    page?: string;
    limit?: string;
    status?: string;
    gender?: string;
  };
  params: {
    clientId: string;
  };
}

const Page = ({ searchParams, params }: PageProps) => {
  return (
    <ClientLocationListingPage
      clientId={params.clientId}
      searchParams={searchParams}
    />
  );
};

export default Page;
