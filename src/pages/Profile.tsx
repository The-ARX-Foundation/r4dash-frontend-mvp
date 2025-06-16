
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/ui/navigation';
import { Shield, Users } from 'lucide-react';
import { useMockAuth, useMockRole } from '@/hooks/useMockData';

const Profile = () => {
  const { user, profile } = useMockAuth();
  const { role, permissions } = useMockRole();

  const RoleIcon = role === 'coordinator' ? Shield : Users;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 pb-24">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <RoleIcon className="w-6 h-6" />
              User Profile (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-lg">{profile?.name || 'Demo User'}</p>
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
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="text-lg text-green-600">Demo Mode Active</p>
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

            <div className="pt-4 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  🚀 This is a demo profile with coordinator permissions. 
                  All features are accessible for testing purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Navigation />
    </div>
  );
};

export default Profile;
