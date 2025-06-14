import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskSubmission, TaskVerification, TaskClaim, TaskCompletion } from '@/types/task';

export const useUserTasks = (userId?: string) => {
  return useQuery({
    queryKey: ['user-tasks', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching tasks for user:', userId);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .or(`user_id.eq.${userId},volunteer_id.eq.${userId},claimed_by.eq.${userId}`)
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

export const useOpenTasks = () => {
  return useQuery({
    queryKey: ['open-tasks'],
    queryFn: async () => {
      console.log('Fetching open tasks');
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .in('status', ['open', 'verified'])
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching open tasks:', error);
        throw error;
      }
      
      console.log('Fetched open tasks:', data);
      return data as Task[];
    },
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
        .in('status', ['completed', 'pending'])
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

export const useTaskCreation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskData: TaskSubmission & { user_id: string }) => {
      console.log('Creating task:', taskData);
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          location: taskData.location,
          image_url: taskData.image_url,
          user_id: taskData.user_id,
          status: 'open'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }
      
      console.log('Task created successfully:', data);
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['user-tasks'] });
    },
  });
};

// Add the missing useTaskSubmission hook as an alias to useTaskCreation
export const useTaskSubmission = () => {
  return useTaskCreation();
};

export const useTaskClaim = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, claim }: { taskId: string; claim: TaskClaim }) => {
      console.log('Claiming task:', taskId, claim);
      
      const { data, error } = await supabase
        .from('tasks')
        .update({
          status: claim.status,
          claimed_by: claim.claimed_by,
          claimed_at: claim.claimed_at
        })
        .eq('id', taskId)
        .eq('status', 'open')
        .select()
        .single();
      
      if (error) {
        console.error('Error claiming task:', error);
        throw error;
      }
      
      console.log('Task claimed successfully:', data);
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['user-tasks'] });
    },
  });
};

export const useTaskCompletion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, completion }: { taskId: string; completion: TaskCompletion }) => {
      console.log('Completing task:', taskId, completion);
      
      const { data, error } = await supabase
        .from('tasks')
        .update({
          status: completion.status,
          image_url: completion.image_url,
          submitted_at: completion.submitted_at,
          volunteer_id: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) {
        console.error('Error completing task:', error);
        throw error;
      }
      
      console.log('Task completed successfully:', data);
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
