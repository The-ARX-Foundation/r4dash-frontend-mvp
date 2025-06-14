
import React, { useState } from 'react';
import { Map, Layers, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Navigation from '@/components/ui/navigation';
import TaskMap from './TaskMap';
import MapFilters from './MapFilters';

interface MapViewProps {
  userId: string;
}

const MapView: React.FC<MapViewProps> = ({ userId }) => {
  const [radius, setRadius] = useState(10);
  const [urgencyFilter, setUrgencyFilter] = useState<string[]>([]);
  const [skillTagsFilter, setSkillTagsFilter] = useState<string[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>();

  const handleLocationSearch = (query: string) => {
    // In a real app, you'd use a geocoding service here
    console.log('Searching for location:', query);
    toast.success('Location search would be implemented with a geocoding service');
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([longitude, latitude]);
          toast.success('Location updated to your current position');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get your current location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Map className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-bold">Task Map</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="text-sm">Badge Heatmap</span>
              <Switch 
                checked={showHeatmap}
                onCheckedChange={setShowHeatmap}
              />
            </div>
          </div>
        </div>

        <MapFilters
          radius={radius}
          urgencyFilter={urgencyFilter}
          skillTagsFilter={skillTagsFilter}
          onRadiusChange={setRadius}
          onUrgencyChange={setUrgencyFilter}
          onSkillTagsChange={setSkillTagsFilter}
          onLocationSearch={handleLocationSearch}
          onCurrentLocation={handleCurrentLocation}
        />

        <Card>
          <CardContent className="p-0">
            <TaskMap
              userId={userId}
              filters={{
                radius,
                urgencyFilter,
                skillTagsFilter,
                center: mapCenter
              }}
              showHeatmap={showHeatmap}
            />
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                High Urgency Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Critical and high priority tasks that need immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Verified Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Tasks that have been verified by community administrators
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Available Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Open tasks ready for community members to claim
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default MapView;
