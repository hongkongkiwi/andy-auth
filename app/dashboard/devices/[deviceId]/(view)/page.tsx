import DeviceViewPage from './_components/DeviceViewPage';

interface PageProps {
  params: {
    deviceId: string;
  };
}

const Page = ({ params }: PageProps) => {
  return <DeviceViewPage deviceId={params.deviceId} />;
};

export default Page;
