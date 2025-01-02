import { parseAsString, parseAsInteger } from 'nuqs/server';

export const searchParams = {
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  status: parseAsString.withDefault(''),
  priority: parseAsString.withDefault(''),
  gender: parseAsString.withDefault('')
};
