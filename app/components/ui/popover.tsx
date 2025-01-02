'use client';

import * as React from 'react';
import { Popper } from './popper';
import { useCallbackRef } from '@/hooks/use-callback-ref';

interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const PopoverContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

const Popover = React.memo(
  ({
    children,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange
  }: PopoverProps) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

    const open = controlledOpen ?? uncontrolledOpen;
    const onOpenChange = useCallbackRef(
      controlledOnOpenChange ?? setUncontrolledOpen
    );

    return (
      <PopoverContext.Provider value={{ open, onOpenChange }}>
        {children}
      </PopoverContext.Provider>
    );
  }
);

const PopoverTrigger = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    const context = React.useContext(PopoverContext);
    if (!context) throw new Error('PopoverTrigger must be used within Popover');

    const { open, onOpenChange } = context;

    const handleClick = React.useCallback(() => {
      onOpenChange(!open);
    }, [open, onOpenChange]);

    return React.cloneElement(
      React.Children.only(children) as React.ReactElement,
      {
        onClick: handleClick
      }
    );
  }
);

const PopoverContent = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    const context = React.useContext(PopoverContext);
    if (!context) throw new Error('PopoverContent must be used within Popover');

    return <Popper open={context.open}>{children}</Popper>;
  }
);

Popover.displayName = 'Popover';
PopoverTrigger.displayName = 'PopoverTrigger';
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };
