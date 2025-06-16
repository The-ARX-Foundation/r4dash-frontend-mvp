
import AdminTaskQueue from '@/components/tasks/AdminTaskQueue';
import { useMockAuth } from '@/hooks/useMockData';

const AdminTaskQueuePage = () => {
  const { user } = useMockAuth();

  return <AdminTaskQueue adminId={user.id} />;
};

export default AdminTaskQueuePage;
