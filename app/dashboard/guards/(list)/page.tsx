import GuardListingPage from './_components/GuardListingPage';

interface PageProps {
  searchParams: {
    q?: string;
    page?: string;
    limit?: string;
    status?: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  return <GuardListingPage searchParams={searchParams} />;
};

export default Page;
