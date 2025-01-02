'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
}

const Loading = ({ className }: LoadingProps) => (
  <div
    className={cn('flex h-screen items-center justify-center', className)}
    role="status"
    aria-live="polite"
  >
    <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
    <span className="sr-only">Loading...</span>
  </div>
);

export default Loading;
