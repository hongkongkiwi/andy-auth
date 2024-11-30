import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  q: parseAsString,
  gender: parseAsString,
  categories: parseAsString,
  status: parseAsString,
  role: parseAsString,
  active: parseAsString,
  state: parseAsString,
  city: parseAsString,
  sortBy: parseAsString.withDefault('created_at'),
  sortOrder: parseAsString.withDefault('desc'),
  workspace: parseAsInteger,
  client: parseAsString
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
