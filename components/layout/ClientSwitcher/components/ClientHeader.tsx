'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientAvatar } from './ClientAvatar';
import type { ClientHeaderProps } from '../types';
import { cn } from '@/lib/utils';
import { useClient } from '../hooks/useClient';
import type { Client, Workspace } from '@/constants/mock-api';

type PartialClient = Pick<Client, 'id' | 'name' | 'imageUrl'> & {
  workspace: Pick<Workspace, 'id' | 'displayName'>;
};

export const ClientHeader = ({
  client,
  showWorkspaceName = true,
  showBackButton = true,
  className,
  headerText = 'Client Dashboard'
}: ClientHeaderProps) => {
  const { setSelectedClient } = useClient();

  const handleBack = () => {
    setSelectedClient(undefined);
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {showWorkspaceName && client.workspace?.displayName && (
        <WorkspaceContext workspaceName={client.workspace.displayName} />
      )}
      <ClientBar
        client={client}
        onBack={handleBack}
        showBackButton={showBackButton}
        headerText={headerText}
      />
    </div>
  );
};

const WorkspaceContext = ({ workspaceName }: { workspaceName: string }) => (
  <span className="text-xs text-muted-foreground">{workspaceName}</span>
);

const ClientBar = ({
  client,
  onBack,
  showBackButton,
  headerText
}: {
  client: PartialClient;
  onBack: () => void;
  showBackButton: boolean;
  headerText: string;
}) => (
  <div className="flex items-center gap-2">
    <ClientInfo client={client} headerText={headerText} />
    {showBackButton && <BackButton onClick={onBack} />}
  </div>
);

const ClientInfo = ({
  client,
  className,
  headerText
}: {
  client: PartialClient;
  className?: string;
  headerText: string;
}): JSX.Element => (
  <div className={cn('flex items-center gap-2', className)}>
    <ClientAvatar src={client.imageUrl} alt={client.name} size="md" />
    <div className="flex flex-col">
      <span className="text-sm font-semibold leading-tight">{client.name}</span>
      <span className="text-xs leading-tight text-muted-foreground">
        {headerText}
      </span>
    </div>
  </div>
);

const BackButton = ({ onClick }: { onClick: () => void }): JSX.Element => (
  <Button variant="ghost" size="sm" onClick={onClick} className="h-7 px-2">
    <ArrowLeft className="h-3.5 w-3.5" />
  </Button>
);
