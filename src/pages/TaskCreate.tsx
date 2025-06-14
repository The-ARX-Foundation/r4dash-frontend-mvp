
import TaskCreate from '@/components/tasks/TaskCreate';

const TaskCreatePage = () => {
  // In a real app, you'd get this from your auth context
  // For demo purposes, using a placeholder ID
  const userId = "demo-user-id";

  return <TaskCreate userId={userId} />;
};

export default TaskCreatePage;
