
import TaskBrowser from '@/components/tasks/TaskBrowser';
import { useMockAuth } from '@/hooks/useMockData';

const TaskBrowserPage = () => {
  const { user } = useMockAuth();

  return <TaskBrowser userId={user.id} />;
};

export default TaskBrowserPage;
