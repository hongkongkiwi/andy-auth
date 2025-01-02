import { createContext, useContext } from 'react';
import type { NavigationItem } from '../types';

interface NavigationContextType {
  activeId?: string;
  onSelect?: (item: NavigationItem) => void;
}

const NavigationContext = createContext<NavigationContextType>({});

export const useNavigationContext = () => useContext(NavigationContext);
