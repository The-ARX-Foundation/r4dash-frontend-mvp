
import React from 'react';
import { format } from 'date-fns';
import { MapPin, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOpenTasks, useTaskClaim } from '@/hooks/useTasks';
import { getImageUrl } from '@/utils/imageUpload';
import { toast } from 'sonner';

interface TaskBrowserProps {
  userId: string;
}

const TaskBrowser: React.FC<TaskBrowserProps> = ({ userId }) => {
  const { data: openTasks, isLoading, error } = useOpenTasks();
  const taskClaim = useTaskClaim();

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
      
      toast.success('Task claimed! You can now work on completing it.');
    } catch (error) {
      console.error('Error claiming task:', error);
      toast.error('Failed to claim task. It may have been claimed by someone else.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Available Tasks</h1>
          <div className="text-center py-8">Loading available tasks...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Available Tasks</h1>
          <div className="text-center py-8 text-red-600">
            Error loading tasks. Please refresh the page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Available Tasks</h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {openTasks?.length || 0} Available
          </Badge>
        </div>

        {!openTasks || openTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No Available Tasks</h3>
              <p className="text-gray-600">Check back later for new tasks to help with!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {openTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    Posted {format(new Date(task.created_at), 'MMM d, yyyy')}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {task.description && (
                    <p className="text-gray-700 text-sm">{task.description}</p>
                  )}
                  
                  {task.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {task.location}
                    </div>
                  )}
                  
                  {task.image_url && (
                    <img 
                      src={getImageUrl(task.image_url)} 
                      alt="Task reference" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      Posted by community member
                    </div>
                    
                    <Button
                      onClick={() => handleClaimTask(task.id)}
                      disabled={taskClaim.isPending || task.user_id === userId}
                      size="sm"
                    >
                      {task.user_id === userId ? 'Your Task' : 'Help Out'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskBrowser;
