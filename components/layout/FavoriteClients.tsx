import type { Client } from '@/constants/mock-api';

type FavoriteClientsProps = {
  clients: Client[];
  onClientClick: (clientId: string) => void;
}; 