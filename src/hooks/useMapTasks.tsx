
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
      console.log('useMapTasks: Fetching map tasks with filters:', filters);
      
      let filteredTasks = [...MOCK_TASKS];
      console.log('useMapTasks: Starting with', filteredTasks.length, 'total tasks');

      // Apply status filter - fetch pending and verified as per requirements
      if (filters.status && filters.status.length > 0) {
        filteredTasks = filteredTasks.filter(task => filters.status!.includes(task.status));
        console.log('useMapTasks: After status filter:', filteredTasks.length, 'tasks');
      } else {
        // Default to pending and verified tasks
        filteredTasks = filteredTasks.filter(task => ['pending', 'verified', 'open'].includes(task.status));
        console.log('useMapTasks: After default status filter:', filteredTasks.length, 'tasks');
      }

      // Apply urgency filter
      if (filters.urgency && filters.urgency.length > 0) {
        filteredTasks = filteredTasks.filter(task => filters.urgency!.includes(task.urgency));
        console.log('useMapTasks: After urgency filter:', filteredTasks.length, 'tasks');
      }

      // Apply skill tags filter
      if (filters.skillTags && filters.skillTags.length > 0) {
        filteredTasks = filteredTasks.filter(task => 
          task.skill_tags.some(tag => filters.skillTags!.includes(tag))
        );
        console.log('useMapTasks: After skill tags filter:', filteredTasks.length, 'tasks');
      }

      // Apply geographic radius filter if coordinates and radius are provided
      if (filters.latitude && filters.longitude && filters.radius) {
        console.log('useMapTasks: Applying radius filter:', {
          centerLat: filters.latitude,
          centerLng: filters.longitude,
          radius: filters.radius
        });
        
        const tasksWithDistance = filteredTasks.map(task => {
          if (!task.latitude || !task.longitude) {
            return { task, distance: Infinity, hasCoords: false };
          }
          const distance = calculateDistance(
            filters.latitude!,
            filters.longitude!,
            task.latitude,
            task.longitude
          );
          return { task, distance, hasCoords: true };
        });
        
        // Log some distance calculations for debugging
        tasksWithDistance.slice(0, 5).forEach(({ task, distance, hasCoords }) => {
          console.log('useMapTasks: Task distance:', {
            id: task.id,
            title: task.title.substring(0, 30),
            taskLat: task.latitude,
            taskLng: task.longitude,
            distance: distance.toFixed(2) + 'km',
            hasCoords,
            withinRadius: distance <= filters.radius!
          });
        });
        
        filteredTasks = tasksWithDistance
          .filter(({ distance }) => distance <= filters.radius!)
          .map(({ task }) => task);
          
        console.log('useMapTasks: After radius filter (', filters.radius, 'km):', filteredTasks.length, 'tasks');
      }

      // Sort by created_at descending
      filteredTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      console.log('useMapTasks: Final filtered tasks:', filteredTasks.length);
      console.log('useMapTasks: Sample tasks:', filteredTasks.slice(0, 3).map(t => ({
        id: t.id,
        title: t.title.substring(0, 30),
        lat: t.latitude,
        lng: t.longitude,
        status: t.status
      })));
      
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
