'use client';

import { IncidentTableContainer } from './IncidentTableContainer';
import type { ReactElement } from 'react';

interface IncidentListingPageProps {
  clientId: string;
  page?: string;
  pageLimit?: string;
  search?: string;
  status?: string;
  priority?: string;
}

const IncidentListingPage = ({
  clientId,
  page,
  pageLimit,
  search,
  status,
  priority
}: IncidentListingPageProps): ReactElement => {
  return (
    <IncidentTableContainer
      clientId={clientId}
      page={page}
      pageLimit={pageLimit}
      search={search}
      status={status}
      priority={priority}
    />
  );
};

export default IncidentListingPage;
