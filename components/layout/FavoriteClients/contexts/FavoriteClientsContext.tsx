'use client';

import { createContext, useContext } from 'react';
import { Client } from '@/constants/mock-api';
import { useFavoriteClients } from '../hooks/useFavoriteClients';

interface FavoriteClientsContextType {
  favoriteClients: Client[];
  addFavorite: (client: Client) => void;
  removeFavorite: (clientId: string) => void;
  reorderFavorites: (newOrder: Client[]) => void;
  isFavorite: (clientId: string) => boolean;
}

const FavoriteClientsContext = createContext<FavoriteClientsContextType | null>(
  null
);

export const FavoriteClientsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const favoriteClientsState = useFavoriteClients();

  return (
    <FavoriteClientsContext.Provider value={favoriteClientsState}>
      {children}
    </FavoriteClientsContext.Provider>
  );
};

export const useFavoriteClientsContext = () => {
  const context = useContext(FavoriteClientsContext);
  if (!context) {
    throw new Error(
      'useFavoriteClientsContext must be used within a FavoriteClientsProvider'
    );
  }
  return context;
};
