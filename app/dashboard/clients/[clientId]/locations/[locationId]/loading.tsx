import { Skeleton } from '@/components/ui/skeleton';
import PageContainer from '@/components/layout/PageContainer';

export default function Loading() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="mt-2 h-4 w-[300px]" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    </PageContainer>
  );
}
