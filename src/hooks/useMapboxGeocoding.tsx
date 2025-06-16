
import { useQuery } from '@tanstack/react-query';
import { useMapboxToken } from './useMapboxToken';

interface GeocodingResult {
  id: string;
  type: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  bbox?: [number, number, number, number];
}

interface GeocodingResponse {
  type: 'FeatureCollection';
  query: string[];
  features: GeocodingResult[];
}

export const useMapboxGeocoding = (searchQuery: string, enabled: boolean = false) => {
  const { data: mapboxToken } = useMapboxToken();

  return useQuery({
    queryKey: ['mapbox-geocoding', searchQuery],
    queryFn: async () => {
      if (!mapboxToken || !searchQuery.trim()) {
        throw new Error('Missing token or search query');
      }

      console.log('Geocoding search for:', searchQuery);
      
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${mapboxToken}&limit=5`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }
      
      const data: GeocodingResponse = await response.json();
      console.log('Geocoding results:', data);
      
      return data.features;
    },
    enabled: enabled && Boolean(mapboxToken) && Boolean(searchQuery.trim()),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });
};
