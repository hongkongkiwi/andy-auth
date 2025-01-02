'use client';

import { useState, useEffect, useCallback } from 'react';
import { Client } from '@/constants/mock-api';

const getStoredFavorites = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('clientFavorites');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

const setStoredFavorites = (favorites: Client[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('clientFavorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

export const useFavoriteClients = () => {
  const [favoriteClients, setFavoriteClients] = useState<Client[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load favorites from localStorage only after component mounts
  useEffect(() => {
    setFavoriteClients(getStoredFavorites());
    setMounted(true);
  }, []);

  // Add client to favorites
  const addFavorite = useCallback((client: Client) => {
    setFavoriteClients((prev) => {
      const newFavorites = [...prev, client];
      setStoredFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  // Remove client from favorites
  const removeFavorite = useCallback((clientId: string) => {
    setFavoriteClients((prev) => {
      const newFavorites = prev.filter((c) => c.id !== clientId);
      setStoredFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  // Reorder favorites
  const reorderFavorites = useCallback((newOrder: Client[]) => {
    setFavoriteClients(newOrder);
    setStoredFavorites(newOrder);
  }, []);

  // Check if a client is favorited
  const isFavorite = useCallback(
    (clientId: string) => {
      return mounted && favoriteClients.some((c) => c.id === clientId);
    },
    [favoriteClients, mounted]
  );

  return {
    favoriteClients,
    addFavorite,
    removeFavorite,
    reorderFavorites,
    isFavorite
  };
};
