
import MapView from '@/components/map/MapView';
import { useMockAuth } from '@/hooks/useMockData';

const MapViewPage = () => {
  const { user } = useMockAuth();

  return <MapView userId={user.id} />;
};

export default MapViewPage;
