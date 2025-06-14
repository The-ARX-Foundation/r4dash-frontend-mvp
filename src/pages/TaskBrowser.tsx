
import { useAuth } from '@/contexts/AuthContext';
import TaskBrowser from '@/components/tasks/TaskBrowser';

const TaskBrowserPage = () => {
  const { user, loading } = useAuth();

  console.log('TaskBrowserPage - user:', user);
  console.log('TaskBrowserPage - loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
