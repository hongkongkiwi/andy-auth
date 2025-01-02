import { Metadata } from 'next';
import WorkspaceSettingsPage from './_components/WorkspaceSettingsPage';
import WorkspaceForm from './_components/WorkspaceForm';

export const metadata: Metadata = {
  title: 'Dashboard : Workspace Settings'
};

const Page = () => {
  return <WorkspaceSettingsPage />;
};

export default Page;
