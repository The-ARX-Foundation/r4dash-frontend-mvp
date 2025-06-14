
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Search, CheckSquare, Shield, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/map', icon: Map, label: 'Map', color: 'bg-purple-500' },
    { path: '/create-task', icon: Plus, label: 'Submit', color: 'bg-blue-500' },
    { path: '/browse-tasks', icon: Search, label: 'Browse', color: 'bg-green-500' },
    { path: '/complete-tasks', icon: CheckSquare, label: 'My Tasks', color: 'bg-orange-500' },
    { path: '/admin/tasks', icon: Shield, label: 'Admin', color: 'bg-red-500' },
  ];

  return (
    <Card className="fixed bottom-0 left-0 right-0 p-4 rounded-t-lg border-t bg-white shadow-lg z-50 md:relative md:rounded-lg md:mb-6">
      <div className="flex justify-around items-center max-w-md mx-auto">
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
    </Card>
  );
};

export default Navigation;
