
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { Navigate } from 'react-router-dom';
import Navigation from '@/components/ui/navigation';
import { Shield, Eye, Heart, MessageCircle, Users } from 'lucide-react';

const roleIcons = {
  coordinator: Shield,
  scout: Eye,
  medic: Heart,
  communicator: MessageCircle,
  volunteer: Users
};

const Profile = () => {
  const { user, profile } = useAuth();
  const { role, permissions } = useRole();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    return <Navigate to="/role-selection" replace />;
  }

  const RoleIcon = roleIcons[role as keyof typeof roleIcons] || Users;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 pb-24">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <RoleIcon className="w-6 h-6" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-lg">{profile.name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Role</label>
                  <p className="text-lg capitalize flex items-center gap-2">
                    <RoleIcon className="w-5 h-5" />
                    {role}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Member Since</label>
                  <p className="text-lg">{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Your Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(permissions).map(([key, value]) => (
                  <div key={key} className={`flex items-center gap-2 p-2 rounded ${value ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-sm">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button variant="outline" className="w-full" asChild>
                <a href="/role-selection">Change Role</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Navigation />
    </div>
  );
};

export default Profile;
