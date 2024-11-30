'use client';

import React, { useState, useCallback } from 'react';
import { type Client } from '@/constants/mock-api';
import {
  DndContext,
  type DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { XCircle, GripVertical, StarOff } from 'lucide-react';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useClient } from '@/components/layout/ClientSwitcher/hooks/useClient';
import { ClientAvatar } from '@/components/layout/ClientSwitcher/components/ClientAvatar';
import { type FavoriteClientsProps } from '../types';

export const FavoriteClients: React.FC<FavoriteClientsProps> = ({
  clients,
  onClientClick,
  onReorder,
  onRemove,
}) => {
  const [items, setItems] = useState<Client[]>(clients);
  const [isEditing, setIsEditing] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { setSelectedClient } = useClient();

  React.useEffect(() => {
    setItems(clients);
  }, [clients]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
        delay: 0,
        tolerance: 5,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleRemove = useCallback((clientId: string) => {
    setRemovingId(clientId);
  }, []);

  const handleRemoveComplete = useCallback(() => {
    if (removingId) {
      setItems((prevItems) => {
        const newItems = prevItems.filter(item => item.id !== removingId);
        onRemove?.(removingId);
        return newItems;
      });
      setRemovingId(null);
    }
  }, [removingId, onRemove]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active?.id && over?.id && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        onReorder?.(newOrder);
        return newOrder;
      });
    }
  };

  const handleItemClick = useCallback((e: React.MouseEvent, client: Client) => {
    if (e.shiftKey) {
      e.preventDefault();
      setIsEditing(true);
    } else {
      setSelectedClient(client);
      onClientClick(client.id);
    }
  }, [setSelectedClient, onClientClick]);

  return (
    <div className="px-4 py-2">
      <h2 className="mb-2 text-sm font-semibold">Favorite Clients</h2>
      <div className="w-full bg-background pt-1 px-4 pb-4 overflow-x-hidden">
        <div className="flex flex-col">
          {isEditing && items.length > 0 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 -mt-1.5">
              <p>Drag to reorder items</p>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 hover:bg-accent rounded-md"
                aria-label="Exit edit mode"
              >
                <XCircle className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-0 w-full overflow-x-hidden">
          {items.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-1 overflow-x-hidden">
                  {items.map((client) => (
                    <SortableItem 
                      key={client.id} 
                      id={client.id} 
                      disabled={!isEditing}
                      isRemoving={removingId === client.id}
                      onAnimationComplete={handleRemoveComplete}
                    >
                      <div className="group relative flex items-center gap-2 rounded-md border bg-background px-2 py-1.5 hover:bg-accent transition-colors w-full">
                        {!isEditing ? (
                          <div
                            onClick={(e) => handleItemClick(e, client)}
                            className="flex items-center gap-2 cursor-pointer flex-1"
                          >
                            <ClientAvatar
                              src={client.imageUrl}
                              alt={client.name}
                              size="sm"
                            />
                            <span className="text-xs font-medium">{client.name}</span>
                          </div>
                        ) : (
                          <>
                            <div className="cursor-grab">
                              <GripVertical className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <ClientAvatar
                                src={client.imageUrl}
                                alt={client.name}
                                size="sm"
                              />
                              <span className="text-xs font-medium">{client.name}</span>
                            </div>
                          </>
                        )}
                        {isEditing && onRemove && (
                          <div 
                            className="ml-auto relative z-20" 
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleRemove(client.id);
                              }}
                              className="cursor-pointer p-2 hover:bg-accent rounded-md -mr-1 -my-1"
                              aria-label="Remove from favorites"
                            >
                              <StarOff 
                                className="h-3 w-3 text-muted-foreground hover:text-destructive" 
                                strokeWidth={2}
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : null}
        </div>
      </div>
    </div>
  );
};
