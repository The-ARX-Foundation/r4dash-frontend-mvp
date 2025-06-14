
export interface Task {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  status: 'open' | 'claimed' | 'completed' | 'pending' | 'verified' | 'flagged';
  volunteer_id: string | null;
  user_id: string; // creator of the task
  claimed_by: string | null;
  claimed_at: string | null;
  image_url: string | null;
  submitted_at: string | null;
  verified_by: string | null;
  verified_at: string | null;
  verified: boolean | null;
  created_at: string;
}

export interface TaskSubmission {
  title: string;
  description: string;
  location?: string;
  image_url?: string;
}

export interface TaskVerification {
  status: 'verified' | 'flagged';
  verified_by: string;
  verified_at: string;
}

export interface TaskClaim {
  claimed_by: string;
  claimed_at: string;
  status: 'claimed';
}

export interface TaskCompletion {
  status: 'completed';
  image_url?: string;
  submitted_at: string;
}
