
// Generic badge types that don't depend on auto-generated Supabase types
export interface Badge {
  id: string;
  name: string;
  icon: string;
  criteria: string;
  criteria_type: string;
  criteria_value: number;
  description: string | null;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  volunteer_id: string;
  title: string;
  description: string | null;
  location: string | null;
  status: 'pending' | 'verified' | 'flagged';
  image_url: string | null;
  submitted_at: string;
  verified_by: string | null;
  verified_at: string | null;
  verified: boolean;
  created_at: string;
}

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
