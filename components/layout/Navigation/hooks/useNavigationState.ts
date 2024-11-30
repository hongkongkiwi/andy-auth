import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'navigation:collapsed';

export const useNavigationState = (defaultCollapsed = false) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsCollapsed(stored === 'true');
      }
    } catch (error) {
      console.error('Failed to access localStorage:', error);
    }
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => {
      const newState = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(newState));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
      return newState;
    });
  }, []);

  return {
    isCollapsed,
    toggleCollapse
  };
}; 