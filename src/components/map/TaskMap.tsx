
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapTasks, useBadgeHeatmap } from '@/hooks/useMapTasks';
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [popup, setPopup] = useState<mapboxgl.Popup | null>(null);

  const { data: tasks, isLoading } = useMapTasks({
    urgency: filters.urgencyFilter,
    skillTags: filters.skillTagsFilter,
    status: ['open', 'verified']
  });
  
  const { data: heatmapData } = useBadgeHeatmap();
  const taskClaim = useTaskClaim();

  // Set a temporary mapbox token - user will need to add their own
  const MAPBOX_TOKEN = 'pk.eyJ1IjoidGVtcC11c2VyIiwiYSI6ImNsOXh5YWkxNTB1NWkzdnA4bTBrYzZsdm4ifQ.example';

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
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
  }, []);

  useEffect(() => {
    if (!map.current || !tasks || isLoading) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.task-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add task markers
    tasks.forEach(task => {
      if (!task.latitude || !task.longitude) return;

      const markerColor = getMarkerColor(task);
      
      const markerEl = document.createElement('div');
      markerEl.className = 'task-marker';
      markerEl.style.width = '24px';
      markerEl.style.height = '24px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.backgroundColor = markerColor;
      markerEl.style.border = '2px solid white';
      markerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      markerEl.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([task.longitude, task.latitude])
        .addTo(map.current!);

      markerEl.addEventListener('click', () => {
        handleMarkerClick(task, [task.longitude!, task.latitude!]);
      });
    });

  }, [tasks, isLoading]);

  const getMarkerColor = (task: Task) => {
    if (task.urgency === 'critical' || task.urgency === 'high') {
      return '#ef4444'; // Red
    }
    if (task.status === 'verified') {
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

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes('example')) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold mb-2">Mapbox Token Required</h3>
          <p className="text-gray-600 mb-4">
            Please add your Mapbox public token to use the map feature.
          </p>
          <p className="text-sm text-gray-500">
            Get your token from <a href="https://mapbox.com" className="text-blue-600 hover:underline">mapbox.com</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      {isLoading && (
        <div className="absolute top-4 left-4 bg-white rounded-lg p-2 shadow-md">
          <span className="text-sm text-gray-600">Loading tasks...</span>
        </div>
      )}
    </div>
  );
};

export default TaskMap;
