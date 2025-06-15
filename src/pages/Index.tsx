
import { useAuth } from '@/contexts/AuthContext';
import { useAutoSeed } from '@/hooks/useAutoSeed';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, User, MapPin, LogOut, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/ui/navigation';
import ManualReseedButton from '@/components/ManualReseedButton';
import RoleBasedActions from '@/components/RoleBasedActions';
import { useRole } from '@/hooks/useRole';
import { useState, useEffect } from 'react';

const Index = () => {
  const { user, profile, loading, signOut } = useAuth();
  const { isSeeding, isSeeded } = useAutoSeed();
  const { role, isCoordinator } = useRole();
  const [profileTimeout, setProfileTimeout] = useState(false);

  console.log('Index Page Debug:', {
    user: user?.id,
    profile: profile,
    role,
    isCoordinator,
    loading,
    isSeeding,
    isSeeded
  });

  // Set a timeout for profile loading
  useEffect(() => {
    if (user && !profile && !loading) {
      const timer = setTimeout(() => {
        setProfileTimeout(true);
      }, 5000); // 5 second timeout

      return () => clearTimeout(timer);
    }
  }, [user, profile, loading]);

  const handleRefresh = () => {
    window.location.reload();
  };

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

  // Show timeout message if profile creation is taking too long
  if (user && !profile && (profileTimeout || !loading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Profile Setup Issue</h2>
            <p className="text-gray-600 mb-4">
              We're having trouble setting up your profile. This might be a temporary issue.
            </p>
          </div>
          <div className="space-y-2">
            <Button onClick={handleRefresh} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={signOut} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out & Try Different Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If user doesn't have a profile yet, show loading message
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your profile...</p>
          <p className="text-xs text-gray-400 mt-2">This should only take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Logout */}
        <div className="text-center py-6">
          <div className="flex justify-between items-start mb-4">
            <div></div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
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

        {/* Debug Info Card - Show current state */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-800">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-yellow-700 space-y-1">
              <div>User ID: {user?.id}</div>
              <div>Profile: {profile ? 'Yes' : 'No'} (Role: {profile?.role})</div>
              <div>Detected Role: {role}</div>
              <div>Is Coordinator: {isCoordinator ? 'Yes' : 'No'}</div>
              <div>Data Seeded: {isSeeded ? 'Yes' : 'No'}</div>
              <div>Currently Seeding: {isSeeding ? 'Yes' : 'No'}</div>
            </div>
          </CardContent>
        </Card>

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

        {/* Debug Section - show for all users for now */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">Manual Tools</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <ManualReseedButton />
              <p className="text-xs text-gray-500 self-center">
                {isSeeded ? 'Data loaded' : 'No data detected'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Role-based Actions - This should render based on role */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Available Actions</h2>
          <RoleBasedActions />
        </div>

        {/* Fallback Actions - Always show these */}
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
      </div>
      <Navigation />
    </div>
  );
};

export default Index;
