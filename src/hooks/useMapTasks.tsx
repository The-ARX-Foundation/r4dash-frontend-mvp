
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
        .not('longitude', 'is', null)
        .in('status', filters.status || ['open', 'verified'] as const);

      // Apply urgency filter
      if (filters.urgency && filters.urgency.length > 0) {
        query = query.in('urgency', filters.urgency);
      }

      // Apply skill tags filter
      if (filters.skillTags && filters.skillTags.length > 0) {
        query = query.overlaps('skill_tags', filters.skillTags);
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
      
      // This is a simplified version - in a real app you'd have user locations
      // For now, we'll create mock heatmap data based on task locations
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('latitude, longitude, status')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .eq('status', 'verified');

      if (error) {
        console.error('Error fetching heatmap data:', error);
        throw error;
      }

      // Create heatmap points with mock badge density
      const heatmapPoints = tasks?.map(task => ({
        lat: task.latitude,
        lng: task.longitude,
        intensity: Math.random() * 0.8 + 0.2 // Mock badge density
      })) || [];

      console.log('Generated heatmap points:', heatmapPoints);
      return heatmapPoints;
    },
  });
};
