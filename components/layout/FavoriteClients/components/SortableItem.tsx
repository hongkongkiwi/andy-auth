'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { type SortableItemProps } from '../types';

export const SortableItem = ({ id, children, disabled, isRemoving, onAnimationComplete }: SortableItemProps) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id, 
    disabled
  });

  if (!React.isValidElement(children)) {
    return null;
  }

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).classList.contains('opacity-0')) {
      onAnimationComplete?.();
    }
  };

  const style = {
    ...(children as React.ReactElement).props.style,
    userSelect: 'text',
    WebkitUserSelect: 'text',
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 1 : undefined,
    outline: 'none',
  };

  return React.cloneElement(children as React.ReactElement, {
    ...(children as React.ReactElement).props,
    ref: setNodeRef,
    ...attributes,
    ...listeners,
    style,
    className: cn(
      (children as React.ReactElement).props.className,
      'transition-opacity duration-350',
      isRemoving && 'opacity-0',
      isDragging && '[&_*]:outline-none'
    ),
    onTransitionEnd: handleTransitionEnd
  } as React.HTMLAttributes<HTMLElement>);
}; 