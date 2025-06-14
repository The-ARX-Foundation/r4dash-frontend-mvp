
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Upload, MapPin, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserTasks, useTaskCompletion } from '@/hooks/useTasks';
import { uploadTaskImage, getImageUrl } from '@/utils/imageUpload';
import { toast } from 'sonner';
import Navigation from '@/components/ui/navigation';
import TaskDetailsModal from './TaskDetailsModal';
import { Task } from '@/types/task';

interface TaskCompletionProps {
  userId: string;
}

const TaskCompletion: React.FC<TaskCompletionProps> = ({ userId }) => {
  const { data: userTasks, isLoading } = useUserTasks(userId);
  const taskCompletion = useTaskCompletion();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  const claimedTasks = userTasks?.filter(task => 
    task.status === 'claimed' && task.claimed_by === userId
  ) || [];

  const completedTasks = userTasks?.filter(task => 
    ['completed', 'pending', 'verified', 'flagged'].includes(task.status) && 
    (task.claimed_by === userId || task.volunteer_id === userId)
  ) || [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      setProofImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    if (!proofImage) {
      toast.error('Please upload proof of completion');
      return;
    }

    try {
      setIsUploading(true);
      
      const imageUrl = await uploadTaskImage(proofImage, userId);

      await taskCompletion.mutateAsync({
        taskId,
        completion: {
          status: 'completed',
          image_url: imageUrl,
          submitted_at: new Date().toISOString()
        }
      });

      toast.success('Task completed! Waiting for verification.');
      
      // Reset form
      setSelectedTask(null);
      setProofImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'claimed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Awaiting Review</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>;
      case 'flagged':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Needs Attention</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
          <div className="text-center py-8">Loading your tasks...</div>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-sm px-2 py-1">
              {claimedTasks.length} Active
            </Badge>
            <Badge variant="outline" className="text-sm px-2 py-1">
              {completedTasks.length} Completed
            </Badge>
          </div>
        </div>

        {claimedTasks.length === 0 && completedTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No Tasks Yet</h3>
              <p className="text-gray-600">Claim some tasks from the browse page to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Active Tasks */}
            {claimedTasks.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Active Tasks</h2>
                <div className="space-y-4">
                  {claimedTasks.map((task) => (
                    <Card key={task.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{task.title}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              Claimed {format(new Date(task.claimed_at!), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                          {getStatusBadge(task.status)}
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
                            <h4 className="font-medium mb-2">Reference Image</h4>
                            <img 
                              src={getImageUrl(task.image_url)} 
                              alt="Task reference" 
                              className="w-full max-w-md h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-2">Upload Proof of Completion</h4>
                          
                          {selectedTask === task.id && imagePreview ? (
                            <div className="space-y-3">
                              <img 
                                src={imagePreview} 
                                alt="Proof of completion" 
                                className="w-full max-w-md h-48 object-cover rounded-lg"
                              />
                              <div className="flex space-x-3">
                                <Button
                                  onClick={() => handleCompleteTask(task.id)}
                                  disabled={taskCompletion.isPending || isUploading}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  {taskCompletion.isPending || isUploading ? 'Submitting...' : 'Mark Complete'}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedTask(null);
                                    setProofImage(null);
                                    setImagePreview(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                              <label className="cursor-pointer block text-center">
                                <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">
                                  Upload photo proof of completion
                                </span>
                                <p className="text-xs text-gray-500 mt-1">
                                  Max file size: 5MB
                                </p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    setSelectedTask(task.id);
                                    handleImageChange(e);
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Completed Tasks</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {completedTasks.map((task) => (
                    <Card key={task.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
                          {getStatusBadge(task.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Completed {task.submitted_at ? format(new Date(task.submitted_at), 'MMM d, yyyy') : 'Recently'}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        {task.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            {task.location}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {task.status === 'verified' ? 'Approved' : 
                             task.status === 'flagged' ? 'Needs revision' : 
                             'Under review'}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDetailTask(task)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <TaskDetailsModal
          task={detailTask}
          isOpen={!!detailTask}
          onClose={() => setDetailTask(null)}
          userId={userId}
        />
      </div>
      <Navigation />
    </div>
  );
};

export default TaskCompletion;
