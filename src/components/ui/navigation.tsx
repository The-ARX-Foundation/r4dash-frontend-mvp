
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Search, CheckSquare, Shield, Map, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';

const Navigation = () => {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { hasPermission } = useRole();
  
  if (!user) {
    return (
      <Card className="fixed bottom-0 left-0 right-0 p-4 rounded-t-lg border-t bg-white shadow-lg z-50 md:relative md:rounded-lg md:mb-6">
        <div className="flex justify-center">
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const navItems = [
    { path: '/map', icon: Map, label: 'Map', color: 'bg-purple-500', show: hasPermission('canViewTasks') },
    { path: '/create-task', icon: Plus, label: 'Submit', color: 'bg-blue-500', show: hasPermission('canCreateTasks') },
    { path: '/browse-tasks', icon: Search, label: 'Browse', color: 'bg-green-500', show: hasPermission('canViewTasks') },
    { path: '/complete-tasks', icon: CheckSquare, label: 'My Tasks', color: 'bg-orange-500', show: hasPermission('canViewTasks') },
    { path: '/admin/tasks', icon: Shield, label: 'Admin', color: 'bg-red-500', show: hasPermission('canAccessAdmin') },
  ].filter(item => item.show);

  return (
    <Card className="fixed bottom-0 left-0 right-0 p-4 rounded-t-lg border-t bg-white shadow-lg z-50 md:relative md:rounded-lg md:mb-6">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <div className="flex justify-around items-center flex-1">
          {navItems.map(({ path, icon: Icon, label, color }) => (
            <Link key={path} to={path}>
              <Button 
                variant={location.pathname === path ? "default" : "ghost"}
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  location.pathname === path ? color : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 px-3">
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={signOut}
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-medium">Logout</span>
          </Button>
        </div>
      </div>
      
      {profile && (
        <div className="text-center mt-2 text-xs text-gray-500">
          Role: {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
        </div>
      )}
    </Card>
  );
};

export default Navigation;
