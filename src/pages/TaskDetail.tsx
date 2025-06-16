
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_TASKS, useMockAuth } from '@/hooks/useMockData';
import { useTaskClaim } from '@/hooks/useTasks';
import { toast } from 'sonner';
import TaskDetailsModal from '@/components/tasks/TaskDetailsModal';

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user } = useMockAuth();
  const taskClaim = useTaskClaim();

  const task = MOCK_TASKS.find(t => t.id === taskId);

  const handleClaim = async (taskId: string) => {
    if (!user) return;
    
    try {
      await taskClaim.mutateAsync({
        taskId,
        claim: {
          claimed_by: user.id,
          claimed_at: new Date().toISOString(),
          status: 'claimed'
        }
      });
      
      toast.success('Task claimed successfully!');
      navigate('/complete-tasks');
    } catch (error) {
      console.error('Error claiming task:', error);
      toast.error('Failed to claim task. It may have been claimed by someone else.');
    }
  };

  const handleBack = () => {
    navigate('/map');
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Map
          </Button>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Task Not Found</h2>
            <p className="text-gray-600">The task you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Map
        </Button>
        
        <TaskDetailsModal
          task={task}
          isOpen={true}
          onClose={handleBack}
          onClaim={handleClaim}
          userId={user?.id || ''}
          isLoading={taskClaim.isPending}
        />
      </div>
    </div>
  );
};

export default TaskDetail;
