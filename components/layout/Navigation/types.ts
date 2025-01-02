import { type IconsType } from '@/components/ui/icons';

// Base Types
/** Base navigation item interface */
export interface BaseNavigationItem {
  /** Unique identifier for the item */
  id: string;
  /** Type of navigation item */
  type: NavigationItemType;
  /** Display title */
  title: string;
}

export type NavigationItemType = 'item' | 'separator' | 'group' | 'header';

// Navigation Item Types
export interface NavigationLink extends BaseNavigationItem {
  type: 'item';
  href: string;
  icon?: IconsType;
  disabled?: boolean;
}

export interface NavigationGroupType extends BaseNavigationItem {
  type: 'group';
  items: NavigationItem[];
  collapsible?: boolean;
}

export interface NavigationHeaderType extends BaseNavigationItem {
  type: 'header';
  description?: string;
}

export interface NavigationSeparator extends Omit<BaseNavigationItem, 'title'> {
  type: 'separator';
}

export type NavigationItem =
  | NavigationLink
  | NavigationGroupType
  | NavigationHeaderType
  | NavigationSeparator;

// Component Props Types
export interface NavigationProps {
  items: NavigationItem[];
  label?: string;
  className?: string;
  isCollapsed?: boolean;
  showIcons?: boolean;
  iconSize?: number;
  onNavigate?: () => void;
}

export interface NavigationMenuItemProps {
  item: NavigationLink;
  level?: number;
  isCollapsed?: boolean;
  showIcons?: boolean;
  iconSize?: number;
}

export interface NavigationGroupProps {
  item: NavigationGroupType;
  className?: string;
  isCollapsed?: boolean;
  showIcons?: boolean;
  iconSize?: number;
}

export interface NavigationHeaderProps {
  item: NavigationHeaderType;
  className?: string;
  isCollapsed?: boolean;
}

export type NavigationItemRendererProps = Omit<
  NavigationProps,
  'items' | 'label'
> & {
  item: NavigationItem;
};

// Hook Return Types
export interface UseNavigationReturn {
  isItemActive: (item: NavigationItem) => boolean;
  pathname: string | null;
}

export interface UseCollapsedStateReturn {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}
