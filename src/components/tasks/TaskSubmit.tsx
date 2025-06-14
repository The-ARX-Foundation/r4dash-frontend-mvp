import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, MapPin, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTaskSubmission } from '@/hooks/useTasks';
import { uploadTaskImage } from '@/utils/imageUpload';
import { TaskSubmission } from '@/types/task';
import { toast } from 'sonner';
import Navigation from '@/components/ui/navigation';
import { useNavigate } from 'react-router-dom';

interface TaskSubmitProps {
  userId: string;
}

const TaskSubmit: React.FC<TaskSubmitProps> = ({ userId }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const navigate = useNavigate();
  
  const taskSubmission = useTaskSubmission();
  
  const form = useForm<TaskSubmission>({
    defaultValues: {
      title: '',
      description: '',
      location: '',
    },
  });

  const handleBack = () => {
    navigate('/');
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
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
        let errorMessage = 'Unable to get location. Please enable location services.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        toast.error(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const onSubmit = async (data: TaskSubmission) => {
    // Form validation
    if (!data.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (data.title.length > 100) {
      toast.error('Task title must be less than 100 characters');
      return;
    }

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
      
      // Navigate back to home after successful submission
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error('Failed to submit task. Please try again.');
    }
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
              <CardTitle className="text-xl font-bold">Submit New Task</CardTitle>
              <div className="w-8" /> {/* Spacer for centering */}
            </div>
            <p className="text-sm text-gray-600 text-center">
              Request help from your community
            </p>
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
                          placeholder="What do you need help with?" 
                          {...field} 
                          required
                          maxLength={100}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500">
                        {field.value.length}/100 characters
                      </p>
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
                          placeholder="Provide more details about what needs to be done..."
                          rows={4}
                          {...field}
                          maxLength={500}
                        />
                      </FormControl>
                      <FormMessage />
                      {field.value && (
                        <p className="text-xs text-gray-500">
                          {field.value.length}/500 characters
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Photo (Optional)</label>
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
                      <p className="text-xs text-gray-500 mt-1">
                        Max file size: 5MB
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location (Optional)</label>
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
                      title="Get current location"
                    >
                      <MapPin className={`w-4 h-4 ${isGettingLocation ? 'animate-pulse' : ''}`} />
                    </Button>
                  </div>
                  {isGettingLocation && (
                    <p className="text-xs text-blue-600">Getting your location...</p>
                  )}
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
                    disabled={taskSubmission.isPending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {taskSubmission.isPending ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Navigation />
    </div>
  );
};

export default TaskSubmit;
