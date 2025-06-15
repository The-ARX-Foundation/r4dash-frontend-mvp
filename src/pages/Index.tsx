
import { useAuth } from '@/contexts/AuthContext';
import { useAutoSeed } from '@/hooks/useAutoSeed';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, User, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/ui/navigation';
import ManualReseedButton from '@/components/ManualReseedButton';
import RoleBasedActions from '@/components/RoleBasedActions';
import { useRole } from '@/hooks/useRole';

const Index = () => {
  const { user, profile, loading } = useAuth();
  const { isSeeding, isSeeded } = useAutoSeed();
  const { role, isCoordinator } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user doesn't have a profile yet, they'll be redirected by ProtectedRoute
  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Community Helper
          </h1>
          <p className="text-gray-600">
            Connect, help, and make a difference
          </p>
          {user && (
            <p className="text-sm text-blue-600 mt-2">
              Welcome back, {profile?.name || user.email}!
              <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </p>
          )}
        </div>

        {/* Data Status */}
        {isSeeding && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-blue-700 text-sm">Loading sample data...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Section - only show for coordinators */}
        {isCoordinator && (
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Admin Tools</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <ManualReseedButton />
                <p className="text-xs text-gray-500 self-center">
                  {isSeeded ? 'Data loaded' : 'No data'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Role-based Actions */}
        <RoleBasedActions />

        {/* Quick Actions for non-coordinators */}
        {!isCoordinator && (
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
          </div>
        )}

        {/* Secondary Actions for non-coordinators */}
        {!isCoordinator && (
          <div className="grid grid-cols-2 gap-4">
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
        )}
      </div>
      <Navigation />
    </div>
  );
};

export default Index;
