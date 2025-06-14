
export interface UserProfile {
  id: string;
  user_id: string;
  role: 'coordinator' | 'scout' | 'medic' | 'communicator' | 'volunteer';
  name: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: any;
  session: any;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}

export interface RolePermissions {
  canViewTasks: boolean;
  canCreateTasks: boolean;
  canClaimTasks: boolean;
  canMarkWellnessCheck: boolean;
  canLogMedicalTasks: boolean;
  canAccessAdmin: boolean;
  canVerifyTasks: boolean;
  canViewStats: boolean;
  canManageUsers: boolean;
}
