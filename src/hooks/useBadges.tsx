
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BadgeProgress } from '@/types/badge';

export const useBadges = (userId?: string) => {
  return useQuery({
    queryKey: ['badges', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching badges for user:', userId);
      
      const { data, error } = await supabase
        .from('user_badge_progress')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching badges:', error);
        throw error;
      }
      
      console.log('Fetched badge data:', data);
      return data as BadgeProgress[];
    },
    enabled: !!userId,
  });
};

export const useEarnedBadges = (userId?: string) => {
  return useQuery({
    queryKey: ['earned-badges', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching earned badges for user:', userId);
      
      const { data, error } = await supabase
        .from('user_badge_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('is_earned', true);
      
      if (error) {
        console.error('Error fetching earned badges:', error);
        throw error;
      }
      
      console.log('Fetched earned badges:', data);
      return data as BadgeProgress[];
    },
    enabled: !!userId,
  });
};

export const useAvailableBadges = (userId?: string) => {
  return useQuery({
    queryKey: ['available-badges', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching available badges for user:', userId);
      
      const { data, error } = await supabase
        .from('user_badge_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('is_earned', false);
      
      if (error) {
        console.error('Error fetching available badges:', error);
        throw error;
      }
      
      console.log('Fetched available badges:', data);
      return data as BadgeProgress[];
    },
    enabled: !!userId,
  });
};
