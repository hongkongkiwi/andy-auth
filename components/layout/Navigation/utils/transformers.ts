import type { NavigationItem } from '../types';
import type { NavItem } from '@/types';

export const transformToNavigationItems = (items: NavItem[]): NavigationItem[] => {
  return items.map(item => ({
    id: item.title,
    type: 'item',
    title: item.title,
    icon: item.icon,
    href: item.url || `/dashboard/${item.title.toLowerCase()}`
  }));
}; 