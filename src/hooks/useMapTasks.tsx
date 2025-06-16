
import { useQuery } from '@tanstack/react-query';
import { MOCK_TASKS } from '@/hooks/useMockData';
import { Task } from '@/types/task';

interface MapTasksFilters {
  latitude?: number;
  longitude?: number;
  radius?: number; // km
  urgency?: string[];
  skillTags?: string[];
  status?: ('open' | 'claimed' | 'completed' | 'pending' | 'verified' | 'flagged')[];
}

// Helper function to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const useMapTasks = (filters: MapTasksFilters = {}) => {
  return useQuery({
    queryKey: ['map-tasks', filters],
    queryFn: async () => {
      console.log('Fetching map tasks with filters:', filters);
      
      let filteredTasks = [...MOCK_TASKS];

      // Apply status filter - fetch pending and verified as per requirements
      if (filters.status && filters.status.length > 0) {
        filteredTasks = filteredTasks.filter(task => filters.status!.includes(task.status));
      } else {
        // Default to pending and verified tasks
        filteredTasks = filteredTasks.filter(task => ['pending', 'verified', 'open'].includes(task.status));
      }

      // Apply urgency filter
      if (filters.urgency && filters.urgency.length > 0) {
        filteredTasks = filteredTasks.filter(task => filters.urgency!.includes(task.urgency));
      }

      // Apply skill tags filter
      if (filters.skillTags && filters.skillTags.length > 0) {
        filteredTasks = filteredTasks.filter(task => 
          task.skill_tags.some(tag => filters.skillTags!.includes(tag))
        );
      }

      // Apply geographic radius filter if coordinates and radius are provided
      if (filters.latitude && filters.longitude && filters.radius) {
        filteredTasks = filteredTasks.filter(task => {
          if (!task.latitude || !task.longitude) return false;
          const distance = calculateDistance(
            filters.latitude!,
            filters.longitude!,
            task.latitude,
            task.longitude
          );
          return distance <= filters.radius!;
        });
      }

      // Sort by created_at descending
      filteredTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      console.log('Filtered map tasks:', filteredTasks);
      return filteredTasks as Task[];
    },
  });
};

export const useBadgeHeatmap = () => {
  return useQuery({
    queryKey: ['badge-heatmap'],
    queryFn: async () => {
      console.log('Generating badge heatmap data for College Station area');
      
      // Use verified tasks from mock data as base for heatmap
      const verifiedTasks = MOCK_TASKS.filter(task => task.status === 'verified');
      
      // Create heatmap points based on verified task locations
      const taskHeatmapPoints = verifiedTasks.map(task => ({
        lat: task.latitude!,
        lng: task.longitude!,
        intensity: 0.8
      }));

      // Add additional realistic points around College Station/Texas A&M area
      const collegeStationCenter = { lat: 30.6280, lng: -96.3344 };
      const additionalPoints = Array.from({ length: 15 }, () => ({
        lat: collegeStationCenter.lat + (Math.random() - 0.5) * 0.02, // Small radius around College Station
        lng: collegeStationCenter.lng + (Math.random() - 0.5) * 0.02,
        intensity: Math.random() * 0.6 + 0.2
      }));

      const allPoints = [...taskHeatmapPoints, ...additionalPoints];
      console.log('Generated heatmap points for College Station:', allPoints);
      return allPoints;
    },
  });
};
