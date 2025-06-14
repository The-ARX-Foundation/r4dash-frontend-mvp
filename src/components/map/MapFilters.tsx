
import React from 'react';
import { MapPin, Filter, Target, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface MapFiltersProps {
  radius: number;
  urgencyFilter: string[];
  skillTagsFilter: string[];
  onRadiusChange: (radius: number) => void;
  onUrgencyChange: (urgency: string[]) => void;
  onSkillTagsChange: (tags: string[]) => void;
  onLocationSearch: (query: string) => void;
  onCurrentLocation: () => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({
  radius,
  urgencyFilter,
  skillTagsFilter,
  onRadiusChange,
  onUrgencyChange,
  onSkillTagsChange,
  onLocationSearch,
  onCurrentLocation
}) => {
  const urgencyLevels = ['low', 'medium', 'high', 'critical'];
  const skillTags = ['physical', 'technology', 'teaching', 'elderly-care', 'pets', 'outdoor', 'moving', 'academic'];

  const handleUrgencyChange = (urgency: string, checked: boolean) => {
    if (checked) {
      onUrgencyChange([...urgencyFilter, urgency]);
    } else {
      onUrgencyChange(urgencyFilter.filter(u => u !== urgency));
    }
  };

  const handleSkillTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      onSkillTagsChange([...skillTagsFilter, tag]);
    } else {
      onSkillTagsChange(skillTagsFilter.filter(t => t !== tag));
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Location Search */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search location..."
                onChange={(e) => onLocationSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={onCurrentLocation} variant="outline" size="sm">
              <Target className="w-4 h-4" />
            </Button>
          </div>

          {/* Radius Filter */}
          <div className="flex items-center gap-4">
            <MapPin className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium">Radius: {radius}km</label>
            <input
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={(e) => onRadiusChange(parseInt(e.target.value))}
              className="flex-1"
            />
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Urgency Level</label>
            <div className="flex flex-wrap gap-2">
              {urgencyLevels.map(urgency => (
                <div key={urgency} className="flex items-center space-x-2">
                  <Checkbox
                    id={`urgency-${urgency}`}
                    checked={urgencyFilter.includes(urgency)}
                    onCheckedChange={(checked) => handleUrgencyChange(urgency, checked as boolean)}
                  />
                  <label htmlFor={`urgency-${urgency}`} className="text-sm capitalize">
                    {urgency}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Tags Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Required Skills</label>
            <div className="flex flex-wrap gap-2">
              {skillTags.map(tag => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${tag}`}
                    checked={skillTagsFilter.includes(tag)}
                    onCheckedChange={(checked) => handleSkillTagChange(tag, checked as boolean)}
                  />
                  <label htmlFor={`skill-${tag}`} className="text-sm">
                    {tag.replace('-', ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Active filters:</span>
            {urgencyFilter.map(urgency => (
              <Badge key={urgency} variant="secondary" className="text-xs">
                {urgency}
              </Badge>
            ))}
            {skillTagsFilter.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapFilters;
