import { ScrollArea } from '@/components/ui/scroll-area';

interface PageContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

const PageContainer = ({
  children,
  scrollable = true
}: PageContainerProps) => {
  const contentStyles = "h-full p-4 md:px-6";
  
  return scrollable ? (
    <ScrollArea className="h-[calc(100dvh-52px)]">
      <div className={contentStyles}>{children}</div>
    </ScrollArea>
  ) : (
    <div className={contentStyles}>{children}</div>
  );
};

export default PageContainer;
