
import React, { useState } from 'react';
import { Upload, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskCreation } from '@/hooks/useTasks';
import { uploadTaskImage } from '@/utils/imageUpload';
import { toast } from 'sonner';

interface TaskCreateProps {
  userId: string;
}

const TaskCreate: React.FC<TaskCreateProps> = ({ userId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const taskCreation = useTaskCreation();

  // Generate a valid UUID for demo purposes
  const generateDemoUserId = () => {
    return 'demo-' + crypto.randomUUID().slice(0, 8) + '-' + crypto.randomUUID().slice(0, 4) + '-' + crypto.randomUUID().slice(0, 4) + '-' + crypto.randomUUID().slice(0, 4) + '-' + crypto.randomUUID().slice(0, 12);
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

    try {
      setIsUploading(true);
      
      let imageUrl = '';
      if (image) {
        try {
          imageUrl = await uploadTaskImage(image, userId);
        } catch (imageError) {
          console.log('Image upload failed, continuing without image:', imageError);
          toast.error('Image upload failed, but task will be created without image');
        }
      }

      // Use a proper UUID format for demo
      const demoUserId = crypto.randomUUID();
      
      await taskCreation.mutateAsync({
        title: title.trim(),
        description: description.trim() || '',
        location: location.trim() || '',
        image_url: imageUrl,
        user_id: demoUserId,
      });

      toast.success('Task created successfully! Others can now help complete it.');
      
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create New Task</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Post a task for community members to help complete
            </p>
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

              <Button
                type="submit"
                className="w-full"
                disabled={taskCreation.isPending || isUploading}
              >
                {taskCreation.isPending || isUploading ? 'Creating Task...' : 'Create Task'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskCreate;
