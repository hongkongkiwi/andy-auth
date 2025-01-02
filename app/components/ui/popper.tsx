'use client';

import * as React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  type Placement,
  type ReferenceElement,
  FloatingPortal
} from '@floating-ui/react';
import { cn } from '@/lib/utils';

interface PopperProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  children: React.ReactNode;
  placement?: Placement;
}

const Popper = React.memo(
  ({
    open = false,
    children,
    className,
    placement = 'bottom-start',
    ...props
  }: PopperProps) => {
    const { refs, floatingStyles, update } = useFloating<HTMLDivElement>({
      placement,
      whileElementsMounted: autoUpdate,
      middleware: [offset(5), flip(), shift()]
    });

    const setFloating = React.useCallback(
      (node: HTMLDivElement | null) => {
        refs.floating.current = node;
      },
      [refs.floating]
    );

    if (!open) return null;

    return (
      <div
        ref={setFloating}
        className={cn('z-50', className)}
        style={floatingStyles}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Popper.displayName = 'Popper';

export { Popper };
