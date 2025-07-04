
import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { MapPin, User, Clock, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/ui/navigation';
import TaskFilters from './TaskFilters';
import TaskDetailsModal from './TaskDetailsModal';
import { Task } from '@/types/task';
import { useMockTasks } from '@/hooks/useMockData';

interface TaskBrowserProps {
  userId: string;
}

const TaskBrowser: React.FC<TaskBrowserProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { openTasks } = useMockTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTasks = useMemo(() => {
    if (!openTasks) return [];

    let filtered = openTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = locationFilter === 'all' || 
        task.location?.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesLocation;
    });

    // Sort tasks
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'location':
        filtered.sort((a, b) => (a.location || '').localeCompare(b.location || ''));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [openTasks, searchTerm, locationFilter, sortBy]);

  const handleClaimTask = async (taskId: string) => {
    // Mock claim functionality
    toast.success('Task claimed! (This is a demo - no actual claiming happened)');
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Available Tasks</h1>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {filteredTasks.length} Available
          </Badge>
        </div>

        <TaskFilters
          onLocationFilter={setLocationFilter}
          onSortChange={setSortBy}
          onSearch={setSearchTerm}
          totalTasks={filteredTasks.length}
        />

        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No Matching Tasks</h3>
              <p className="text-gray-600">
                {searchTerm || locationFilter !== 'all' 
                  ? 'No tasks match your current filters. Try adjusting your search.'
                  : 'Check back later for new tasks to help with!'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 pb-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 whitespace-nowrap ml-2">
                      {task.status || 'Available'}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    Posted {format(new Date(task.created_at), 'MMM d, yyyy')}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {task.description && (
                    <p className="text-gray-700 text-sm line-clamp-2">{task.description}</p>
                  )}
                  
                  {task.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{task.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      Community member
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTask(task)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                      <Button
                        onClick={() => handleClaimTask(task.id)}
                        disabled={task.user_id === userId}
                        size="sm"
                      >
                        {task.user_id === userId ? 'Your Task' : 'Help Out'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <TaskDetailsModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onClaim={handleClaimTask}
          userId={userId}
          isLoading={false}
        />
      </div>
      <Navigation />
    </div>
  );
};

export default TaskBrowser;
