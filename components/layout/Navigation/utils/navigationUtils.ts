import { NavigationItem, NavigationHeader, NavigationGroup, NavigationLink } from '../types';

export const isNavigationHeader = (item: NavigationItem): item is NavigationHeader => 
  item.type === 'header';

export const isNavigationGroup = (item: NavigationItem): item is NavigationGroup => 
  item.type === 'group';

export const isNavigationLink = (item: NavigationItem): item is NavigationLink => 
  item.type === 'item'; 