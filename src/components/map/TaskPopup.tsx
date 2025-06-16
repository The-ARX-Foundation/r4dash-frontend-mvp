
import React from 'react';
import { format } from 'date-fns';
import { MapPin, Clock, User, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types/task';
import { getImageUrl } from '@/utils/imageUpload';

interface TaskPopupProps {
  task: Task;
  onClaim: (taskId: string) => void;
  onClose: () => void;
  isLoading: boolean;
  userId: string;
}

const TaskPopup: React.FC<TaskPopupProps> = ({
  task,
  onClaim,
  onClose,
  isLoading,
  userId
}) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-80 max-w-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex-shrink-0 p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(task.status || 'open')}>
            {task.status}
          </Badge>
          {task.urgency && (
            <Badge className={`text-white ${getUrgencyColor(task.urgency)}`}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              {task.urgency}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-gray-700 text-sm line-clamp-3">{task.description}</p>
        )}
        
        {task.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{task.location}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          Posted {format(new Date(task.created_at), 'MMM d, yyyy')}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <User className="w-4 h-4 mr-1" />
          Community member
        </div>

        {task.skill_tags && task.skill_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.skill_tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        )}
        
        {task.image_url && (
          <img 
            src={getImageUrl(task.image_url)} 
            alt="Task reference" 
            className="w-full h-24 object-cover rounded-lg"
          />
        )}
        
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            onClick={() => onClaim(task.id)}
            disabled={isLoading || task.user_id === userId}
            className="flex-1"
            size="sm"
          >
            {task.user_id === userId ? 'Your Task' : 'Claim Task'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskPopup;
