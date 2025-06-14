
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskSubmission, TaskVerification } from '@/types/task';

export const useUserTasks = (userId?: string) => {
  return useQuery({
    queryKey: ['user-tasks', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching tasks for user:', userId);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('volunteer_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user tasks:', error);
        throw error;
      }
      
      console.log('Fetched user tasks:', data);
      return data as Task[];
    },
    enabled: !!userId,
  });
};

export const usePendingTasks = () => {
  return useQuery({
    queryKey: ['pending-tasks'],
    queryFn: async () => {
      console.log('Fetching pending tasks for admin');
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching pending tasks:', error);
        throw error;
      }
      
      console.log('Fetched pending tasks:', data);
      return data as Task[];
    },
  });
};

export const useTaskSubmission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskData: TaskSubmission & { volunteer_id: string }) => {
      console.log('Submitting task:', taskData);
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          location: taskData.location,
          image_url: taskData.image_url,
          volunteer_id: taskData.volunteer_id,
          user_id: taskData.volunteer_id, // for compatibility
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error submitting task:', error);
        throw error;
      }
      
      console.log('Task submitted successfully:', data);
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['pending-tasks'] });
    },
  });
};

export const useTaskVerification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, verification }: { taskId: string; verification: TaskVerification }) => {
      console.log('Verifying task:', taskId, verification);
      
      const { data, error } = await supabase
        .from('tasks')
        .update({
          status: verification.status,
          verified_by: verification.verified_by,
          verified_at: verification.verified_at,
          verified: verification.status === 'verified'
        })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) {
        console.error('Error verifying task:', error);
        throw error;
      }
      
      console.log('Task verified successfully:', data);
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['user-tasks'] });
    },
  });
};
