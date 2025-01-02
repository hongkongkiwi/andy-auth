'use client';

import { type FC } from 'react';
import { NavigationMenuItem } from './NavigationMenuItem';
import { NavigationGroup } from './NavigationGroup';
import { NavigationHeader } from './NavigationHeader';
import {
  type NavigationItemRendererProps,
  type NavigationHeaderType as INavigationHeader,
  type NavigationGroupType as INavigationGroup,
  type NavigationLink
} from '../types';

export const NavigationItemRenderer: FC<NavigationItemRendererProps> = ({
  item,
  isCollapsed,
  ...props
}) => {
  switch (item.type) {
    case 'header':
      return (
        <NavigationHeader
          item={item as INavigationHeader}
          isCollapsed={isCollapsed}
          {...props}
        />
      );
    case 'group':
      return (
        <NavigationGroup
          item={item as INavigationGroup}
          isCollapsed={isCollapsed}
          {...props}
        />
      );
    case 'item':
      return (
        <NavigationMenuItem
          item={item as NavigationLink}
          isCollapsed={isCollapsed}
          {...props}
        />
      );
    case 'separator':
      return <div className="my-2 border-t" />;
    default:
      return null;
  }
};

NavigationItemRenderer.displayName = 'NavigationItemRenderer';
