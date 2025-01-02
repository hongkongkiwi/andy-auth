'use client';

import { AppSidebar } from '@/components/layout/AppSidebar';
import { TopMenu } from '@/components/layout/TopMenu';
import { ClientProvider } from '@/components/layout/ClientSwitcher/contexts/ClientContext';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher/contexts/WorkspaceContext';
import NoWorkspaceContent from '@/app/dashboard/error-pages/no-workspace/content';
import { Protected } from '@/app/auth/_components';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { selectedWorkspace } = useWorkspace();

  return (
    <Protected requireVerification>
      <ClientProvider>
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <TopMenu />
            <div className="px-8 pb-8 pt-4">
              {selectedWorkspace ? children : <NoWorkspaceContent />}
            </div>
          </div>
        </div>
      </ClientProvider>
    </Protected>
  );
}
