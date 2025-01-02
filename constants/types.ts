import type { LucideIcon } from 'lucide-react';

export type NavigationIconType =
  | 'user'
  | 'locations'
  | 'devices'
  | 'clients'
  | 'dashboard'
  | 'overview'
  | 'incident'
  | 'report'
  | 'guard'
  | 'guards'
  | 'device'
  | 'settings'
  | 'location'
  | 'patrol'
  | 'patrols'
  | 'chevronLeft'
  | 'chevronRight';

export interface NavigationLink {
  id: string;
  title: string;
  href: string;
  icon?: NavigationIconType;
  isDefault?: boolean;
  type: 'item';
}

export type NavigationItem = NavigationLink;

export interface TrpcClient {
  id: string;
  displayName: string;
  imageUrl: string | null;
  workspace: {
    id: string;
    displayName: string;
  };
  timezone?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
