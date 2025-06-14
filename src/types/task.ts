
export interface Task {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  status: 'pending' | 'verified' | 'flagged';
  volunteer_id: string;
  user_id: string; // kept for compatibility
  image_url: string | null;
  submitted_at: string;
  verified_by: string | null;
  verified_at: string | null;
  verified: boolean | null; // kept for compatibility
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
