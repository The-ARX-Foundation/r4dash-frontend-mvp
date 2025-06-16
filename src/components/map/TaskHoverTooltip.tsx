
import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskHoverTooltipProps {
  task: Task;
  position: { x: number; y: number };
}

const TaskHoverTooltip: React.FC<TaskHoverTooltipProps> = ({ task, position }) => {
  const getUrgencyColor = (urgency: string | null) => {
    switch (urgency) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div 
      className="absolute z-50 bg-white rounded-lg shadow-lg border p-3 max-w-xs pointer-events-none"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <h4 className="font-semibold text-sm mb-1 truncate">{task.title}</h4>
      
      {task.urgency && (
        <div className="flex items-center gap-1 mb-1">
          <Clock className="w-3 h-3" />
          <span className={`text-xs font-medium ${getUrgencyColor(task.urgency)}`}>
            {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)} Priority
          </span>
        </div>
      )}
      
      {task.location && (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-gray-500" />
          <span className="text-xs text-gray-600 truncate">{task.location}</span>
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        Click to view details & claim
      </div>
    </div>
  );
};

export default TaskHoverTooltip;
