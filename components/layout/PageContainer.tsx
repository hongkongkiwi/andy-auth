import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  className?: string;
}

const PageContainer = ({
  children,
  scrollable = true,
  className
}: PageContainerProps) => {
  const contentStyles = cn('p-4 md:px-6', className);

  return scrollable ? (
    <div>
      <ScrollArea className="h-full">
        <div className={contentStyles}>{children}</div>
      </ScrollArea>
    </div>
  ) : (
    <div className={contentStyles}>{children}</div>
  );
};

export default PageContainer;
