import { LucideIcon } from 'lucide-react';
import { type IconsType } from '@/types';

// Base navigation item types
export interface BaseNavigationItem {
  id: string;
  title: string;
  type: 'item' | 'header' | 'group';
  icon?: IconsType | LucideIcon;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  external?: boolean;
}

// Navigation link type
export type NavigationLink = Omit<BaseNavigationItem, 'type'> & {
  type: 'item';
  href: string;
  badge?: string | number;
  tooltip?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

// Navigation header type
export type NavigationHeader = Omit<BaseNavigationItem, 'type'> & {
  type: 'header';
};

// Navigation group type
export type NavigationGroup = Omit<BaseNavigationItem, 'type'> & {
  type: 'group';
  items: NavigationItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
};

// Add support for component items
export interface NavigationComponentItem {
  type: 'component';
  id: string;
  component: React.ReactNode;
}

// Update NavigationItem type to include component items
export type NavigationItem = 
  | NavigationHeader 
  | NavigationGroup 
  | NavigationLink 
  | NavigationComponentItem;

// Props for navigation components
export interface NavigationProps {
  items: NavigationItem[];
  label?: string;
  className?: string;
  isCollapsed: boolean;
  onNavigate?: (item: NavigationItem) => void;
  showIcons?: boolean;
  iconSize?: number;
} 