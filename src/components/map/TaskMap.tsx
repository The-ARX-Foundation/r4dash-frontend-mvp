
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapTasks, useBadgeHeatmap } from '@/hooks/useMapTasks';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { useTaskClaim } from '@/hooks/useTasks';
import { Task } from '@/types/task';
import { toast } from 'sonner';
import TaskPopup from './TaskPopup';
import { createRoot } from 'react-dom/client';

interface TaskMapProps {
  userId: string;
  filters: {
    radius: number;
    urgencyFilter: string[];
    skillTagsFilter: string[];
    center?: [number, number];
  };
  showHeatmap: boolean;
}

const TaskMap: React.FC<TaskMapProps> = ({ userId, filters, showHeatmap }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const heatmapLayer = useRef<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [popup, setPopup] = useState<mapboxgl.Popup | null>(null);

  const { data: mapboxToken, isLoading: tokenLoading, error: tokenError } = useMapboxToken();
  const { data: tasks, isLoading: tasksLoading } = useMapTasks({
    latitude: filters.center?.[1],
    longitude: filters.center?.[0],
    radius: filters.radius,
    urgency: filters.urgencyFilter,
    skillTags: filters.skillTagsFilter,
    status: ['pending', 'verified', 'open']
  });
  
  const { data: heatmapData } = useBadgeHeatmap();
  const taskClaim = useTaskClaim();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || tokenLoading) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: filters.center || [-73.9857, 40.7484], // Default to NYC
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, tokenLoading]);

  // Update map center when filters change
  useEffect(() => {
    if (!map.current || !filters.center) return;
    
    map.current.flyTo({
      center: filters.center,
      zoom: 12,
      duration: 1000
    });
  }, [filters.center]);

  // Add task markers
  useEffect(() => {
    if (!map.current || !tasks || tasksLoading) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.task-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add task markers
    tasks.forEach(task => {
      if (!task.latitude || !task.longitude) return;

      const markerColor = getMarkerColor(task);
      
      const markerEl = document.createElement('div');
      markerEl.className = 'task-marker';
      markerEl.style.width = '20px';
      markerEl.style.height = '20px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.backgroundColor = markerColor;
      markerEl.style.border = '3px solid white';
      markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      markerEl.style.cursor = 'pointer';
      markerEl.style.transition = 'transform 0.2s ease';

      // Add hover effect
      markerEl.addEventListener('mouseenter', () => {
        markerEl.style.transform = 'scale(1.2)';
      });
      
      markerEl.addEventListener('mouseleave', () => {
        markerEl.style.transform = 'scale(1)';
      });

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([task.longitude, task.latitude])
        .addTo(map.current!);

      markerEl.addEventListener('click', () => {
        handleMarkerClick(task, [task.longitude!, task.latitude!]);
      });
    });

  }, [tasks, tasksLoading]);

  // Handle heatmap toggle
  useEffect(() => {
    if (!map.current || !heatmapData) return;

    if (showHeatmap && !heatmapLayer.current) {
      // Add heatmap source
      map.current.addSource('badge-heatmap', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: heatmapData.map(point => ({
            type: 'Feature',
            properties: {
              intensity: point.intensity
            },
            geometry: {
              type: 'Point',
              coordinates: [point.lng, point.lat]
            }
          }))
        }
      });

      // Add heatmap layer
      map.current.addLayer({
        id: 'badge-heatmap-layer',
        type: 'heatmap',
        source: 'badge-heatmap',
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': 0.6,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,255,0)',
            0.1, 'royalblue',
            0.3, 'cyan',
            0.5, 'lime',
            0.7, 'yellow',
            1, 'red'
          ],
          'heatmap-radius': 30,
          'heatmap-opacity': 0.7
        }
      });

      heatmapLayer.current = 'badge-heatmap-layer';
    } else if (!showHeatmap && heatmapLayer.current) {
      // Remove heatmap layer
      if (map.current.getLayer(heatmapLayer.current)) {
        map.current.removeLayer(heatmapLayer.current);
      }
      if (map.current.getSource('badge-heatmap')) {
        map.current.removeSource('badge-heatmap');
      }
      heatmapLayer.current = null;
    }
  }, [showHeatmap, heatmapData]);

  const getMarkerColor = (task: Task) => {
    // Red = urgent OR unverified tasks
    if (task.urgency === 'critical' || task.urgency === 'high' || task.status === 'pending') {
      return '#ef4444'; // Red
    }
    // Green = verified AND open tasks  
    if (task.status === 'verified' && task.status !== 'claimed') {
      return '#22c55e'; // Green
    }
    return '#3b82f6'; // Blue default
  };

  const handleMarkerClick = (task: Task, coordinates: [number, number]) => {
    if (popup) {
      popup.remove();
    }

    const newPopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 25
    })
      .setLngLat(coordinates)
      .setHTML('<div id="popup-content"></div>')
      .addTo(map.current!);

    setPopup(newPopup);
    setSelectedTask(task);

    // Render React component in popup
    const popupContent = document.getElementById('popup-content');
    if (popupContent) {
      const root = createRoot(popupContent);
      root.render(
        <TaskPopup
          task={task}
          onClaim={handleClaimTask}
          onClose={() => {
            newPopup.remove();
            setPopup(null);
            setSelectedTask(null);
          }}
          isLoading={taskClaim.isPending}
          userId={userId}
        />
      );
    }
  };

  const handleClaimTask = async (taskId: string) => {
    try {
      await taskClaim.mutateAsync({
        taskId,
        claim: {
          claimed_by: userId,
          claimed_at: new Date().toISOString(),
          status: 'claimed'
        }
      });
      
      toast.success('Task claimed successfully!');
      
      if (popup) {
        popup.remove();
        setPopup(null);
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('Error claiming task:', error);
      toast.error('Failed to claim task. It may have been claimed by someone else.');
    }
  };

  // Loading state
  if (tokenLoading) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (tokenError) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold mb-2">Mapbox Token Required</h3>
          <p className="text-gray-600 mb-4">
            Please configure your Mapbox public token in the project settings.
          </p>
          <p className="text-sm text-gray-500">
            Get your token from <a href="https://mapbox.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">mapbox.com</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      {tasksLoading && (
        <div className="absolute top-4 left-4 bg-white rounded-lg p-2 shadow-md">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Loading tasks...</span>
          </div>
        </div>
      )}
      {tasks && (
        <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-md">
          <span className="text-sm text-gray-600">{tasks.length} tasks found</span>
        </div>
      )}
    </div>
  );
};

export default TaskMap;
