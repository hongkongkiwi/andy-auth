import { Suspense } from 'react';
import GuardViewPage from '../_components/GuardViewPage';

interface PageProps {
  params: {
    guardId: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense>
      <GuardViewPage guardId={params.guardId} />
    </Suspense>
  );
}
