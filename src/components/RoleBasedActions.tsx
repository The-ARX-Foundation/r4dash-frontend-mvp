
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { Plus, Search, Shield, Eye, Heart, MessageCircle, CheckSquare } from 'lucide-react';

const RoleBasedActions = () => {
  const { role, hasPermission } = useRole();

  const getActionsForRole = () => {
    switch (role) {
      case 'coordinator':
        return [
          {
            title: 'Review Pending Tasks',
            description: 'Verify and approve submitted tasks',
            icon: Shield,
            path: '/admin/tasks',
            color: 'bg-red-500 hover:bg-red-600'
          },
          {
            title: 'Browse All Tasks',
            description: 'View and manage community tasks',
            icon: Search,
            path: '/browse-tasks',
            color: 'bg-green-500 hover:bg-green-600'
          },
          {
            title: 'View Task Map',
            description: 'See tasks on an interactive map',
            icon: Eye,
            path: '/map',
            color: 'bg-purple-500 hover:bg-purple-600'
          }
        ];
      
      case 'scout':
        return [
          {
            title: 'Submit New Task',
            description: 'Report community needs you\'ve identified',
            icon: Plus,
            path: '/create-task',
            color: 'bg-blue-500 hover:bg-blue-600'
          },
          {
            title: 'Browse Tasks',
            description: 'Find tasks in your area',
            icon: Search,
            path: '/browse-tasks',
            color: 'bg-green-500 hover:bg-green-600'
          },
          {
            title: 'Wellness Checks',
            description: 'View tasks requiring wellness checks',
            icon: Heart,
            path: '/browse-tasks?filter=wellness',
            color: 'bg-pink-500 hover:bg-pink-600'
          }
        ];
      
      case 'medic':
        return [
          {
            title: 'Medical Priority Tasks',
            description: 'Handle urgent medical situations',
            icon: Heart,
            path: '/browse-tasks?filter=medical',
            color: 'bg-red-500 hover:bg-red-600'
          },
          {
            title: 'My Active Tasks',
            description: 'Manage your assigned tasks',
            icon: CheckSquare,
            path: '/complete-tasks',
            color: 'bg-orange-500 hover:bg-orange-600'
          },
          {
            title: 'Submit New Task',
            description: 'Report medical needs',
            icon: Plus,
            path: '/create-task',
            color: 'bg-blue-500 hover:bg-blue-600'
          }
        ];

      case 'communicator':
        return [
          {
            title: 'Browse Tasks',
            description: 'Coordinate community efforts',
            icon: Search,
            path: '/browse-tasks',
            color: 'bg-green-500 hover:bg-green-600'
          },
          {
            title: 'Submit New Task',
            description: 'Help identify communication needs',
            icon: Plus,
            path: '/create-task',
            color: 'bg-blue-500 hover:bg-blue-600'
          },
          {
            title: 'Task Map',
            description: 'View geographical task distribution',
            icon: Eye,
            path: '/map',
            color: 'bg-purple-500 hover:bg-purple-600'
          }
        ];

      case 'volunteer':
      default:
        return [
          {
            title: 'Find Tasks to Help',
            description: 'Browse available community tasks',
            icon: Search,
            path: '/browse-tasks',
            color: 'bg-green-500 hover:bg-green-600'
          },
          {
            title: 'Submit a Request',
            description: 'Ask for help from the community',
            icon: Plus,
            path: '/create-task',
            color: 'bg-blue-500 hover:bg-blue-600'
          },
          {
            title: 'My Tasks',
            description: 'Track your active commitments',
            icon: CheckSquare,
            path: '/complete-tasks',
            color: 'bg-orange-500 hover:bg-orange-600'
          }
        ];
    }
  };

  const actions = getActionsForRole().filter(action => {
    // Simple permission checking based on path
    if (action.path === '/admin/tasks') return hasPermission('canAccessAdmin');
    if (action.path === '/create-task') return hasPermission('canCreateTasks');
    if (action.path.includes('/browse-tasks')) return hasPermission('canViewTasks');
    if (action.path === '/complete-tasks') return hasPermission('canViewTasks');
    if (action.path === '/map') return hasPermission('canViewTasks');
    return true;
  });

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon className="w-5 h-5" />
                {action.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm">
                {action.description}
              </p>
              <Link to={action.path}>
                <Button className={`w-full ${action.color}`}>
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RoleBasedActions;
