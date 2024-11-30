'use client';

import * as React from 'react';
import { NavigationMenuItem } from './NavigationMenuItem';
import { NavigationGroup } from './NavigationGroup';
import { NavigationHeader } from './NavigationHeader';
import type { NavigationItem, NavigationProps } from '../types';
import { useNavigationState } from '../hooks/useNavigationState';
import { isNavigationLink, isNavigationGroup, isNavigationHeader } from '../utils/navigationUtils';

type NavigationItemRendererProps = Omit<NavigationProps, 'items'> & {
  item: NavigationItem;
  level?: number;
};

const NavigationItemRenderer = React.memo(({
  item,
  level = 0,
  isCollapsed: _isCollapsed,
  ...props
}: NavigationItemRendererProps): React.ReactNode => {
  const { isCollapsed, toggleCollapse } = useNavigationState(false);

  if (isNavigationHeader(item)) {
    return <NavigationHeader item={item} level={level} />;
  }

  if (isNavigationGroup(item)) {
    return (
      <NavigationGroup
        item={item}
        level={level}
        onToggle={toggleCollapse}
        isCollapsed={isCollapsed}
        {...props}
      >
        {item.items.map((subItem) => (
          <NavigationItemRenderer
            key={subItem.id}
            item={subItem}
            level={level + 1}
            isCollapsed={isCollapsed}
            {...props}
          />
        ))}
      </NavigationGroup>
    );
  }

  if (isNavigationLink(item)) {
    return <NavigationMenuItem item={item} level={level} {...props} />;
  }

  return null;
});

NavigationItemRenderer.displayName = 'NavigationItemRenderer';

export { NavigationItemRenderer }; 