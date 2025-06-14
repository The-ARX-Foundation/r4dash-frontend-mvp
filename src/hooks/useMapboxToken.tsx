
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMapboxToken = () => {
  return useQuery({
    queryKey: ['mapbox-token'],
    queryFn: async () => {
      console.log('Fetching Mapbox token');
      
      const { data, error } = await supabase.functions.invoke('get-mapbox-token');
      
      if (error) {
        console.error('Error fetching Mapbox token:', error);
        throw error;
      }
      
      console.log('Mapbox token fetched successfully');
      return data.token;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 1,
  });
};
