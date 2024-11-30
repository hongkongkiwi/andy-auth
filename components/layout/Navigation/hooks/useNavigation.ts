import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { NavigationItem } from '../types';

export const useNavigation = () => {
  const pathname = usePathname();

  const isItemActive = useCallback((item: NavigationItem): boolean => {
    if (!pathname || !('href' in item)) return false;
    return pathname === item.href;
  }, [pathname]);

  return {
    isItemActive,
    pathname
  };
}; 