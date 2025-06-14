
import React from 'react';
import { MapPin, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface TaskFiltersProps {
  onLocationFilter: (location: string) => void;
  onSortChange: (sort: string) => void;
  onSearch: (search: string) => void;
  totalTasks: number;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  onLocationFilter,
  onSortChange,
  onSearch,
  totalTasks
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search tasks..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Select onValueChange={onLocationFilter}>
              <SelectTrigger className="w-36">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="downtown">Downtown</SelectItem>
                <SelectItem value="park">Parks</SelectItem>
                <SelectItem value="shelter">Shelters</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={onSortChange}>
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <span className="text-sm text-gray-600">
            {totalTasks} tasks available
          </span>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Active filters</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskFilters;
