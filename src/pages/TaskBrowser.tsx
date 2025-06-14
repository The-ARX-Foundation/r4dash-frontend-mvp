
import TaskBrowser from '@/components/tasks/TaskBrowser';

const TaskBrowserPage = () => {
  // In a real app, you'd get this from your auth context
  // For demo purposes, using a placeholder ID
  const userId = "demo-user-id";

  return <TaskBrowser userId={userId} />;
};

export default TaskBrowserPage;
