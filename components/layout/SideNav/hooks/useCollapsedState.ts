'use client';

import { useState, useCallback } from 'react';

export interface CollapsedState {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  toggleCollapsed: () => void;
}

export const useCollapsedState = (): CollapsedState => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return {
    isCollapsed,
    setIsCollapsed,
    toggleCollapsed
  };
};
