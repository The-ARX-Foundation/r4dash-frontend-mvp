
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BadgeProgress } from '@/types/badge';

export const useBadges = (userId?: string) => {
  return useQuery({
    queryKey: ['badges', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_badge_progress')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
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
      
      const { data, error } = await supabase
        .from('user_badge_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('is_earned', true);
      
      if (error) throw error;
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
      
      const { data, error } = await supabase
        .from('user_badge_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('is_earned', false);
      
      if (error) throw error;
      return data as BadgeProgress[];
    },
    enabled: !!userId,
  });
};
