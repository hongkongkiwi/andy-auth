'use client';

import { useCallback } from 'react';
import { useAuthStore } from '../stores/auth-store';
import type { User } from '../types';

export const useAuthPersistence = () => {
  const { setUser, clearUser } = useAuthStore();

  const persistAuthState = useCallback(
    async (user: User) => {
      try {
        setUser(user);
        localStorage.setItem('auth_state', JSON.stringify({ user }));
      } catch (error) {
        console.error('Failed to persist auth state:', error);
      }
    },
    [setUser]
  );

  const clearAuthState = useCallback(() => {
    try {
      clearUser();
      localStorage.removeItem('auth_state');
    } catch (error) {
      console.error('Failed to clear auth state:', error);
    }
  }, [clearUser]);

  return { persistAuthState, clearAuthState };
};
