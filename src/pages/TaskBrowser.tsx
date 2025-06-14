
import { useAuth } from '@/contexts/AuthContext';
import TaskBrowser from '@/components/tasks/TaskBrowser';

const TaskBrowserPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to browse tasks.</p>
        </div>
      </div>
    );
  }

  return <TaskBrowser userId={user.id} />;
};

export default TaskBrowserPage;
