
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Shield, Eye, Heart, MessageCircle, Users } from 'lucide-react';

const roles = [
  {
    value: 'volunteer',
    label: 'Volunteer',
    icon: Users,
    description: 'Help with general community tasks and basic assistance',
    permissions: ['View tasks', 'Create tasks', 'Claim tasks']
  },
  {
    value: 'scout',
    label: 'Scout',
    icon: Eye,
    description: 'Identify community needs and perform wellness checks',
    permissions: ['All volunteer permissions', 'Mark wellness checks', 'Field assessments']
  },
  {
    value: 'communicator',
    label: 'Communicator',
    icon: MessageCircle,
    description: 'Coordinate between teams and manage communications',
    permissions: ['All volunteer permissions', 'View statistics', 'Team coordination']
  },
  {
    value: 'medic',
    label: 'Medic',
    icon: Heart,
    description: 'Handle medical tasks and advanced wellness checks',
    permissions: ['All scout permissions', 'Log medical tasks', 'Medical priority access']
  }
  // Removed coordinator - this role must be assigned by existing coordinators
];

const RoleSelection = () => {
  const { profile, updateProfile, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState('volunteer');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user already has any role (including coordinator), redirect to home
  if (profile?.role) {
    return <Navigate to="/" replace />;
  }

  const handleRoleUpdate = async () => {
    setLoading(true);
    const { error } = await updateProfile({ 
      role: selectedRole as any,
      updated_at: new Date().toISOString()
    });
    
    if (!error) {
      // Role updated successfully, redirect to home
      window.location.href = '/';
    }
    setLoading(false);
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as 'scout' | 'medic' | 'communicator' | 'volunteer');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Choose Your Role</CardTitle>
          <p className="text-center text-muted-foreground">
            Select the role that best matches how you'd like to contribute to the community
          </p>
          <p className="text-center text-xs text-gray-500 mt-2">
            Note: Coordinator role must be assigned by existing administrators
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedRole} onValueChange={handleRoleChange} className="space-y-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div key={role.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={role.value} id={role.value} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={role.value} className="flex items-center gap-2 cursor-pointer">
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{role.label}</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-600">Permissions:</p>
                      <ul className="text-xs text-gray-500 mt-1">
                        {role.permissions.map((permission, index) => (
                          <li key={index}>• {permission}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
          
          <div className="mt-6 flex justify-center">
            <Button onClick={handleRoleUpdate} disabled={loading} size="lg">
              {loading ? 'Updating Role...' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelection;
