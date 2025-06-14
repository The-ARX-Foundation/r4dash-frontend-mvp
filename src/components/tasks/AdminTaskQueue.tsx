
import React from 'react';
import { format } from 'date-fns';
import { Check, X, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePendingTasks, useTaskVerification } from '@/hooks/useTasks';
import { getImageUrl } from '@/utils/imageUpload';
import { toast } from 'sonner';

interface AdminTaskQueueProps {
  adminId: string;
}

const AdminTaskQueue: React.FC<AdminTaskQueueProps> = ({ adminId }) => {
  const { data: pendingTasks, isLoading, error } = usePendingTasks();
  const taskVerification = useTaskVerification();

  const handleVerifyTask = async (taskId: string, status: 'verified' | 'flagged') => {
    try {
      await taskVerification.mutateAsync({
        taskId,
        verification: {
          status,
          verified_by: adminId,
          verified_at: new Date().toISOString(),
        },
      });
      
      toast.success(`Task ${status === 'verified' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error verifying task:', error);
      toast.error('Failed to update task status. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Task Queue</h1>
          <div className="text-center py-8">Loading pending tasks...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Task Queue</h1>
          <div className="text-center py-8 text-red-600">
            Error loading tasks. Please refresh the page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Task Queue</h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {pendingTasks?.length || 0} Pending
          </Badge>
        </div>

        {!pendingTasks || pendingTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No Pending Tasks</h3>
              <p className="text-gray-600">All tasks have been reviewed!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{task.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Submitted {format(new Date(task.submitted_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {task.description && (
                    <div>
                      <h4 className="font-medium mb-1">Description</h4>
                      <p className="text-gray-700 text-sm">{task.description}</p>
                    </div>
                  )}
                  
                  {task.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {task.location}
                    </div>
                  )}
                  
                  {task.image_url && (
                    <div>
                      <div className="flex items-center mb-2">
                        <Camera className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Photo Evidence</span>
                      </div>
                      <img 
                        src={getImageUrl(task.image_url)} 
                        alt="Task evidence" 
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button
                      onClick={() => handleVerifyTask(task.id, 'verified')}
                      disabled={taskVerification.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleVerifyTask(task.id, 'flagged')}
                      disabled={taskVerification.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
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

export default AdminTaskQueue;
