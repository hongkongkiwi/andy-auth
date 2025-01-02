import type { NavigationItem } from '../types';

export const processNavigationItems = (
  items: NavigationItem[],
  clientId?: string
): NavigationItem[] => {
  if (!items?.length) return [];
  if (!clientId) return items;

  return items.map((item) => {
    if (item.type === 'item' && item.href) {
      return {
        ...item,
        href: item.href.replace(/\[clientId\]/g, clientId)
      };
    }
    if (item.type === 'group') {
      return {
        ...item,
        items: processNavigationItems(item.items, clientId)
      };
    }
    return item;
  });
};

export const filterNavigationItems = (
  items: NavigationItem[],
  predicate: (item: NavigationItem) => boolean
): NavigationItem[] => {
  return items.filter((item) => {
    if (item.type === 'group') {
      const filteredItems = filterNavigationItems(item.items, predicate);
      return filteredItems.length > 0;
    }
    return predicate(item);
  });
};
