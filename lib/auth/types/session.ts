import type { DefaultSession } from 'next-auth';
import type { SessionUser } from './user';

export interface Session extends DefaultSession {
  expires: string;
  user: SessionUser;
}
