
import { UserProfile } from '@/components/badges/UserProfile';

const Index = () => {
  // In a real app, you'd get this from your auth context
  // For demo purposes, using a placeholder ID
  const userId = "demo-user-id";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Badge System</h1>
          <p className="text-xl text-gray-600">Track your achievements and progress</p>
        </div>
        
        <UserProfile userId={userId} />
      </div>
    </div>
  );
};

export default Index;
