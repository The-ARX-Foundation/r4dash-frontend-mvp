
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task';

interface MapTasksFilters {
  latitude?: number;
  longitude?: number;
  radius?: number; // km
  urgency?: string[];
  skillTags?: string[];
  status?: ('open' | 'claimed' | 'completed' | 'pending' | 'verified' | 'flagged')[];
}

export const useMapTasks = (filters: MapTasksFilters = {}) => {
  return useQuery({
    queryKey: ['map-tasks', filters],
    queryFn: async () => {
      console.log('Fetching map tasks with filters:', filters);
      
      let query = supabase
        .from('tasks')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      // Apply status filter - fetch pending and verified as per requirements
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      } else {
        // Default to pending and verified tasks
        query = query.in('status', ['pending', 'verified', 'open']);
      }

      // Apply urgency filter
      if (filters.urgency && filters.urgency.length > 0) {
        query = query.in('urgency', filters.urgency);
      }

      // Apply skill tags filter
      if (filters.skillTags && filters.skillTags.length > 0) {
        query = query.overlaps('skill_tags', filters.skillTags);
      }

      // Apply geographic radius filter if coordinates and radius are provided
      if (filters.latitude && filters.longitude && filters.radius) {
        // Using a simple bounding box for now - in production you'd use PostGIS
        const earthRadius = 6371; // km
        const latRange = (filters.radius / earthRadius) * (180 / Math.PI);
        const lngRange = (filters.radius / earthRadius) * (180 / Math.PI) / Math.cos(filters.latitude * Math.PI / 180);
        
        query = query
          .gte('latitude', filters.latitude - latRange)
          .lte('latitude', filters.latitude + latRange)
          .gte('longitude', filters.longitude - lngRange)
          .lte('longitude', filters.longitude + lngRange);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching map tasks:', error);
        throw error;
      }

      console.log('Fetched map tasks:', data);
      return data as Task[];
    },
  });
};

export const useBadgeHeatmap = () => {
  return useQuery({
    queryKey: ['badge-heatmap'],
    queryFn: async () => {
      console.log('Fetching badge heatmap data');
      
      // Query tasks to create realistic badge density points
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('latitude, longitude, status, verified_by')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .eq('status', 'verified');

      if (error) {
        console.error('Error fetching heatmap data:', error);
        throw error;
      }

      // Create heatmap points based on verified task density
      const locationGroups: { [key: string]: number } = {};
      
      tasks?.forEach(task => {
        const key = `${Math.round(task.latitude * 100)},${Math.round(task.longitude * 100)}`;
        locationGroups[key] = (locationGroups[key] || 0) + 1;
      });

      const heatmapPoints = Object.entries(locationGroups).map(([key, count]) => {
        const [lat, lng] = key.split(',').map(n => parseFloat(n) / 100);
        return {
          lat,
          lng,
          intensity: Math.min(count / 5, 1) // Normalize intensity
        };
      });

      // Add some random points for demonstration
      const additionalPoints = Array.from({ length: 20 }, () => ({
        lat: 40.7589 + (Math.random() - 0.5) * 0.1,
        lng: -73.9851 + (Math.random() - 0.5) * 0.1,
        intensity: Math.random() * 0.8 + 0.2
      }));

      const allPoints = [...heatmapPoints, ...additionalPoints];
      console.log('Generated heatmap points:', allPoints);
      return allPoints;
    },
  });
};
