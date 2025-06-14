
import React from 'react';
import { format } from 'date-fns';
import { X, MapPin, User, Calendar, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task } from '@/types/task';
import { getImageUrl } from '@/utils/imageUpload';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onClaim?: (taskId: string) => void;
  userId: string;
  isLoading?: boolean;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
  onClaim,
  userId,
  isLoading = false
}) => {
  if (!task) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-50 text-green-700 border-green-200';
      case 'claimed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'verified': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'flagged': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold pr-8">{task.title}</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getStatusColor(task.status)}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              Posted {format(new Date(task.created_at), 'MMM d, yyyy')}
            </div>
          </div>

          {task.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-700 leading-relaxed">{task.description}</p>
            </div>
          )}

          {task.location && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 text-gray-500" />
              <div>
                <h4 className="font-medium">Location</h4>
                <p className="text-gray-700">{task.location}</p>
              </div>
            </div>
          )}

          {task.image_url && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-gray-500" />
                <h4 className="font-medium">Reference Image</h4>
              </div>
              <img 
                src={getImageUrl(task.image_url)} 
                alt="Task reference" 
                className="w-full h-64 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>Posted by community member</span>
          </div>

          {task.claimed_by && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                This task was claimed {task.claimed_at ? format(new Date(task.claimed_at), 'MMM d, yyyy h:mm a') : 'recently'}
              </p>
            </div>
          )}

          {task.status === 'open' && onClaim && (
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => onClaim(task.id)}
                disabled={isLoading || task.user_id === userId}
                className="flex-1"
                size="lg"
              >
                {task.user_id === userId ? 'Your Task' : isLoading ? 'Claiming...' : 'Claim This Task'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
