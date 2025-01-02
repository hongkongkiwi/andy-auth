'use client';

import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  columns: number;
  rows: number;
}

export const TableSkeleton = ({ columns, rows }: TableSkeletonProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`
            }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`${rowIndex}-${colIndex}`}
                className="h-10 w-full"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
