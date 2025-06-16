
import React, { useState } from 'react';
import { Upload, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/ui/navigation';

interface TaskCreateProps {
  userId: string;
}

const TaskCreate: React.FC<TaskCreateProps> = ({ userId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setIsCreating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      toast.success('Task created successfully! (Demo mode - no actual task created)');
      
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setImage(null);
      setImagePreview(null);
      setIsCreating(false);
      
      // Navigate back to home
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-xl font-bold">Create New Task</CardTitle>
              <div className="w-8" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Post a task for community members to help complete
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
              <p className="text-xs text-yellow-700 text-center">
                Demo Mode: Tasks won't be saved to database
              </p>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Task Title *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Help elderly neighbor with groceries"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide more details about what needs to be done..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where should this task be completed?"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Reference Image (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload a reference image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleBack}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating Task...' : 'Create Task'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Navigation />
    </div>
  );
};

export default TaskCreate;
