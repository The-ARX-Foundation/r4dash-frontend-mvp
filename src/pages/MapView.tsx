
import MapView from '@/components/map/MapView';

const MapViewPage = () => {
  // In a real app, you'd get this from your auth context
  const userId = "demo-user-id";

  return <MapView userId={userId} />;
};

export default MapViewPage;
