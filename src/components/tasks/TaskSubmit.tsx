
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTaskSubmission } from '@/hooks/useTasks';
import { uploadTaskImage } from '@/utils/imageUpload';
import { TaskSubmission } from '@/types/task';
import { toast } from 'sonner';

interface TaskSubmitProps {
  userId: string;
}

const TaskSubmit: React.FC<TaskSubmitProps> = ({ userId }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const taskSubmission = useTaskSubmission();
  
  const form = useForm<TaskSubmission>({
    defaultValues: {
      title: '',
      description: '',
      location: '',
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setLocation(locationString);
        form.setValue('location', locationString);
        setIsGettingLocation(false);
        toast.success('Location captured successfully');
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Unable to get location. Please enable location services.');
        setIsGettingLocation(false);
      }
    );
  };

  const onSubmit = async (data: TaskSubmission) => {
    try {
      let imageUrl = '';
      
      if (imageFile) {
        imageUrl = await uploadTaskImage(imageFile, userId);
      }
      
      await taskSubmission.mutateAsync({
        ...data,
        location: location || data.location,
        image_url: imageUrl,
        user_id: userId,
      });
      
      toast.success('Task submitted successfully!');
      form.reset();
      setImageFile(null);
      setImagePreview('');
      setLocation('');
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error('Failed to submit task. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">Submit New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What did you do?" 
                          {...field} 
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us more about your task..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Photo</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {imageFile ? 'Change Photo' : 'Add Photo'}
                    </Button>
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter location or use GPS"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        form.setValue('location', e.target.value);
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={taskSubmission.isPending}
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {taskSubmission.isPending ? 'Submitting...' : 'Submit Task'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskSubmit;
