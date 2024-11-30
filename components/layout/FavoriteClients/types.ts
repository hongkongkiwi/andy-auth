import { type Client } from '@/constants/mock-api';

export interface FavoriteClientsProps {
  clients: Client[];
  onClientClick: (clientId: string) => void;
  onReorder?: (newOrder: Client[]) => void;
  onRemove?: (clientId: string) => void;
}

export interface SortableItemProps {
  children: React.ReactNode;
  id: string;
  disabled?: boolean;
  isRemoving?: boolean;
  onAnimationComplete?: () => void;
}
