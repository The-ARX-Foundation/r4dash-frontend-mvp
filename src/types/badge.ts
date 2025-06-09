
import { Database } from '@/integrations/supabase/types';

export type Badge = Database['public']['Tables']['badges']['Row'];
export type UserBadge = Database['public']['Tables']['user_badges']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];

export interface BadgeProgress {
  user_id: string;
  badge_id: string;
  name: string;
  icon: string;
  criteria: string;
  criteria_type: string;
  criteria_value: number;
  description: string | null;
  earned_at: string | null;
  is_earned: boolean;
  current_progress: number;
  progress_value: number;
}
