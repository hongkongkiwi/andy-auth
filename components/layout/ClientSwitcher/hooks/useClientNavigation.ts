import { NavigationItem } from '../types';
import { useClient } from './useClient';

export const useClientNavigation = () => {
  const { clientNavItems, setClientNavItems, selectedClient } = useClient();
  
  const updateNavItems = (items: NavigationItem[]): void => {
    if (!selectedClient) return;
    
    const validatedItems = items.map(item => ({
      ...item,
      href: item.href.includes(selectedClient.id.toString())
        ? item.href
        : `/dashboard/client/${selectedClient.id}${item.href}`
    }));
    
    setClientNavItems(validatedItems);
  };
  
  const getActiveItem = (): NavigationItem | undefined => {
    if (typeof window === 'undefined') return undefined;
    return clientNavItems.find(item => item.href === window.location.pathname);
  };
  
  return {
    clientNavItems,
    updateNavItems,
    getActiveItem,
    isLoaded: !!selectedClient
  };
}; 