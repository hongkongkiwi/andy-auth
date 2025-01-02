import { AUTH_METHODS } from '@/lib/auth/constants';
export type AuthMethod = (typeof AUTH_METHODS)[number];
