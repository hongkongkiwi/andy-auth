import UserViewPage from '../../(list)/_components/UserViewPage';

export const metadata = {
  title: 'Dashboard : User View'
};

export default function Page({ params }: { params: { userId: string } }) {
  return <UserViewPage userId={params.userId} />;
}
