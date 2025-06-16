
/* 
REFACTORING OPPORTUNITIES FOR TaskMap.tsx:

1. **MapMarkers Component** - Extract marker creation and management logic (lines 85-130)
   - handleMarkerHover, handleMarkerClick, createMarkerElement functions
   - Marker styling and event handling

2. **HeatmapLayer Component** - Extract heatmap toggle functionality (lines 132-175)
   - Heatmap source/layer management
   - Toggle logic and styling

3. **MapControls Hook** - Extract map initialization and control logic (lines 45-80)
   - Map setup, navigation controls, center updates
   - Token validation and error handling

4. **TaskLoadingStates Component** - Extract loading/error UI components (lines 180-220)
   - Loading spinner, error messages, task counter
   - Could be reused across other map components

5. **useMapInteractions Hook** - Extract hover/tooltip logic
   - Task hover state management
   - Position calculations for tooltips

6. **MapConstants** - Extract configuration constants
   - Default coordinates, zoom levels, marker colors
   - Map styles and animation settings
*/

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapTasks, useBadgeHeatmap } from '@/hooks/useMapTasks';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { Task } from '@/types/task';
import TaskHoverTooltip from './TaskHoverTooltip';

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
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const heatmapLayer = useRef<string | null>(null);
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  // Default to College Station coordinates - consistent across app
  const defaultCenter: [number, number] = [-96.3344, 30.6280];

  const { data: mapboxToken, isLoading: tokenLoading, error: tokenError } = useMapboxToken();
  
  // Add debugging and make radius filtering more flexible
  console.log('TaskMap filters:', filters);
  console.log('Using coordinates:', {
    lat: filters.center?.[1] || defaultCenter[1],
    lng: filters.center?.[0] || defaultCenter[0],
    radius: filters.radius
  });
  
  const { data: tasks, isLoading: tasksLoading } = useMapTasks({
    latitude: filters.center?.[1] || defaultCenter[1],
    longitude: filters.center?.[0] || defaultCenter[0],
    radius: Math.max(filters.radius, 25), // Ensure minimum 25km radius to catch tasks
    urgency: filters.urgencyFilter,
    skillTags: filters.skillTagsFilter,
    status: ['pending', 'verified', 'open']
  });
  
  // Debug task loading
  console.log('Tasks loaded:', { 
    count: tasks?.length || 0, 
    loading: tasksLoading, 
    tasks: tasks?.slice(0, 3) // Log first 3 tasks
  });
  
  const { data: heatmapData } = useBadgeHeatmap();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || tokenLoading) return;

    console.log('Initializing map with center:', filters.center || defaultCenter);
    
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: filters.center || defaultCenter,
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, tokenLoading]);

  // Update map center when filters change
  useEffect(() => {
    if (!map.current) return;
    
    const targetCenter = filters.center || defaultCenter;
    console.log('Updating map center to:', targetCenter);
    
    map.current.flyTo({
      center: targetCenter,
      zoom: 12,
      duration: 1000
    });
  }, [filters.center]);

  // Add task markers with better debugging
  useEffect(() => {
    if (!map.current || !tasks || tasksLoading) {
      console.log('Not adding markers:', { 
        hasMap: !!map.current, 
        hasTasks: !!tasks, 
        tasksCount: tasks?.length, 
        loading: tasksLoading 
      });
      return;
    }

    console.log('Adding markers for', tasks.length, 'tasks');

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.task-marker');
    console.log('Clearing', existingMarkers.length, 'existing markers');
    existingMarkers.forEach(marker => marker.remove());

    // Add task markers
    let markersAdded = 0;
    tasks.forEach(task => {
      if (!task.latitude || !task.longitude) {
        console.log('Skipping task without coordinates:', task.id, task.title);
        return;
      }

      const markerColor = getMarkerColor(task);
      console.log('Adding marker:', { 
        id: task.id, 
        title: task.title, 
        lat: task.latitude, 
        lng: task.longitude,
        color: markerColor 
      });
      
      const markerEl = document.createElement('div');
      markerEl.className = 'task-marker';
      markerEl.style.width = '20px';
      markerEl.style.height = '20px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.backgroundColor = markerColor;
      markerEl.style.border = '3px solid white';
      markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      markerEl.style.cursor = 'pointer';
      markerEl.style.transition = 'box-shadow 0.2s ease';

      // Add hover effect using box-shadow instead of transform
      markerEl.addEventListener('mouseenter', (e) => {
        markerEl.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4)';
        markerEl.style.zIndex = '10';
        
        const rect = markerEl.getBoundingClientRect();
        const containerRect = mapContainer.current!.getBoundingClientRect();
        
        setHoverPosition({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top
        });
        setHoveredTask(task);
      });
      
      markerEl.addEventListener('mouseleave', () => {
        markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        markerEl.style.zIndex = '1';
        setHoveredTask(null);
        setHoverPosition(null);
      });

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([task.longitude, task.latitude])
        .addTo(map.current!);

      // Click handler to navigate to task detail page
      markerEl.addEventListener('click', () => {
        navigate(`/task/${task.id}`);
      });
      
      markersAdded++;
    });

    console.log('Successfully added', markersAdded, 'markers to map');

  }, [tasks, tasksLoading, navigate]);

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
    if (task.status === 'verified') {
      return '#22c55e'; // Green
    }
    return '#3b82f6'; // Blue default
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
      
      {hoveredTask && hoverPosition && (
        <TaskHoverTooltip
          task={hoveredTask}
          position={hoverPosition}
        />
      )}
      
      {tasksLoading && (
        <div className="absolute top-4 left-4 bg-white rounded-lg p-2 shadow-md">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Loading tasks...</span>
          </div>
        </div>
      )}
      
      {/* Enhanced task counter with debugging info */}
      {tasks && (
        <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-md">
          <div className="text-sm text-gray-600">
            <div>{tasks.length} tasks found</div>
            <div className="text-xs text-gray-400">
              Center: {(filters.center?.[1] || defaultCenter[1]).toFixed(3)}, {(filters.center?.[0] || defaultCenter[0]).toFixed(3)}
            </div>
            <div className="text-xs text-gray-400">
              Radius: {Math.max(filters.radius, 25)}km
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskMap;
