
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, User, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/ui/navigation';
import { useMockAuth, useMockRole } from '@/hooks/useMockData';

const Index = () => {
  const { user, profile } = useMockAuth();
  const { role, isCoordinator } = useMockRole();

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            R4Dash
          </h1>
          <p className="text-gray-600">
            Turn goodwill into impact—at scale
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Welcome back, {profile?.name || user.email}!
            <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          </p>
        </div>

        {/* Coordinator Actions */}
        {isCoordinator && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Coordinator Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/tasks">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <User className="w-8 h-8 text-red-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Admin Queue</h3>
                    <p className="text-sm text-gray-600">Verify completed tasks</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/complete-tasks">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Plus className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Complete Tasks</h3>
                    <p className="text-sm text-gray-600">Finish claimed tasks</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        )}

        {/* Main Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/browse-tasks">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Search className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Browse Tasks</h3>
                  <p className="text-sm text-gray-600">Find ways to help</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/create-task">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Plus className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Request Help</h3>
                  <p className="text-sm text-gray-600">Submit a task</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/map">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Map View</h3>
                  <p className="text-sm text-gray-600">See nearby tasks</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/profile">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <User className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Profile</h3>
                  <p className="text-sm text-gray-600">View achievements</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Footer with About Link */}
        <div className="text-center pt-6 border-t border-gray-200">
          <Link to="/about" className="text-sm text-blue-600 hover:text-blue-800 underline">
            About R4Dash
          </Link>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Index;
