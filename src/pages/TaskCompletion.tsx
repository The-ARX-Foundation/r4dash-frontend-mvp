
import TaskCompletion from '@/components/tasks/TaskCompletion';

const TaskCompletionPage = () => {
  // In a real app, you'd get this from your auth context
  // For demo purposes, using a placeholder ID
  const userId = "demo-user-id";

  return <TaskCompletion userId={userId} />;
};

export default TaskCompletionPage;
