
import { UserProfile } from '@/components/badges/UserProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';

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
        
        {/* Quick Actions */}
        <div className="max-w-md mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/submit-task" className="block">
                <Button className="w-full" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Task
                </Button>
              </Link>
              <Link to="/admin/tasks" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <UserProfile userId={userId} />
      </div>
    </div>
  );
};

export default Index;
