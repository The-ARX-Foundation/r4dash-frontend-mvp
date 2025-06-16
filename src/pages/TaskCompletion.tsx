
import TaskCompletion from '@/components/tasks/TaskCompletion';
import { useMockAuth } from '@/hooks/useMockData';

const TaskCompletionPage = () => {
  const { user } = useMockAuth();

  return <TaskCompletion userId={user.id} />;
};

export default TaskCompletionPage;
