import type { Client } from '@prisma/client';

export interface ClientTableData
  extends Pick<
    Client,
    | 'id'
    | 'displayName'
    | 'companyName'
    | 'clientEmail'
    | 'clientPhoneNumber'
    | 'clientWebsite'
    | 'notes'
    | 'slug'
    | 'workspaceId'
  > {}
