
import TaskSubmit from '@/components/tasks/TaskSubmit';

const TaskSubmitPage = () => {
  // In a real app, you'd get this from your auth context
  // For demo purposes, using a placeholder ID
  const userId = "demo-user-id";

  return <TaskSubmit userId={userId} />;
};

export default TaskSubmitPage;
