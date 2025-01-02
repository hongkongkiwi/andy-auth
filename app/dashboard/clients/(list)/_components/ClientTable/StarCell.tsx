'use client';

import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useCallback } from 'react';
import { Client } from '@/constants/mock-api';
import { useFavoriteClientsContext } from '@/components/layout/FavoriteClients/contexts/FavoriteClientsContext';

interface StarCellProps {
  client: Client;
}

export const StarCell = ({ client }: StarCellProps) => {
  const { isFavorite, addFavorite, removeFavorite } =
    useFavoriteClientsContext();
  const isStarred = isFavorite(client.id);

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isStarred) {
        removeFavorite(client.id);
      } else {
        addFavorite(client);
      }
    },
    [client, isStarred, addFavorite, removeFavorite]
  );

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0"
      onClick={handleToggle}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onMouseEnter={(e) => e.stopPropagation()}
      onMouseLeave={(e) => e.stopPropagation()}
    >
      <Star
        className={`h-4 w-4 ${isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
      />
      <span className="sr-only">
        {isStarred ? 'Remove from favorites' : 'Add to favorites'}
      </span>
    </Button>
  );
};
