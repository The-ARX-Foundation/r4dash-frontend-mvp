
import React, { useState } from 'react';
import { MapPin, Filter, Target, Tags, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

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
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLocationSearch(searchQuery);
  };

  const clearAllFilters = () => {
    onUrgencyChange([]);
    onSkillTagsChange([]);
    onRadiusChange(10);
    setSearchQuery('');
  };

  const activeFilterCount = urgencyFilter.length + skillTagsFilter.length;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Location Search */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search location (e.g., 'Central Park, NYC')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="outline" size="sm">
              Search
            </Button>
            <Button onClick={onCurrentLocation} variant="outline" size="sm">
              <Target className="w-4 h-4" />
            </Button>
          </form>

          {/* Radius Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                Search Radius: {radius}km
              </label>
            </div>
            <Slider
              value={[radius]}
              onValueChange={(value) => onRadiusChange(value[0])}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Urgency Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium block">Urgency Level</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {urgencyLevels.map(urgency => (
                <div key={urgency} className="flex items-center space-x-2">
                  <Checkbox
                    id={`urgency-${urgency}`}
                    checked={urgencyFilter.includes(urgency)}
                    onCheckedChange={(checked) => handleUrgencyChange(urgency, checked as boolean)}
                  />
                  <label htmlFor={`urgency-${urgency}`} className="text-sm capitalize cursor-pointer">
                    {urgency}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Tags Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium block flex items-center gap-2">
              <Tags className="w-4 h-4 text-gray-500" />
              Required Skills
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {skillTags.map(tag => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${tag}`}
                    checked={skillTagsFilter.includes(tag)}
                    onCheckedChange={(checked) => handleSkillTagChange(tag, checked as boolean)}
                  />
                  <label htmlFor={`skill-${tag}`} className="text-sm cursor-pointer">
                    {tag.replace('-', ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {activeFilterCount > 0 ? `${activeFilterCount} active filters:` : 'No active filters'}
              </span>
            </div>
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
            {activeFilterCount > 0 && (
              <Button onClick={clearAllFilters} variant="ghost" size="sm" className="text-xs">
                Clear all
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapFilters;
