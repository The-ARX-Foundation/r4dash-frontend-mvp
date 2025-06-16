
import TaskCreate from '@/components/tasks/TaskCreate';
import { useMockAuth } from '@/hooks/useMockData';

const TaskCreatePage = () => {
  const { user } = useMockAuth();

  return <TaskCreate userId={user.id} />;
};

export default TaskCreatePage;
