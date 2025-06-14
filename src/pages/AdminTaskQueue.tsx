
import AdminTaskQueue from '@/components/tasks/AdminTaskQueue';

const AdminTaskQueuePage = () => {
  // In a real app, you'd get this from your auth context
  // For demo purposes, using a placeholder admin ID
  const adminId = "demo-user-id"; // This matches our admin function

  return <AdminTaskQueue adminId={adminId} />;
};

export default AdminTaskQueuePage;
