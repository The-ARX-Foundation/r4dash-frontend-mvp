
import { UserProfile } from '@/components/badges/UserProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Plus, Search, CheckCircle, Settings } from 'lucide-react';

const Index = () => {
  // In a real app, you'd get this from your auth context
  // For demo purposes, using a placeholder ID
  const userId = "demo-user-id";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Helper</h1>
          <p className="text-xl text-gray-600">Help your community and earn badges</p>
        </div>
        
        {/* Quick Actions */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">What would you like to do?</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/browse-tasks" className="block">
                <Button className="w-full h-16 text-lg" variant="default">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Tasks
                </Button>
              </Link>
              <Link to="/create-task" className="block">
                <Button className="w-full h-16 text-lg" variant="outline">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Task
                </Button>
              </Link>
              <Link to="/complete-tasks" className="block">
                <Button className="w-full h-16 text-lg" variant="secondary">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Tasks
                </Button>
              </Link>
              <Link to="/admin/tasks" className="block">
                <Button className="w-full h-16 text-lg" variant="outline">
                  <Settings className="w-5 h-5 mr-2" />
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
