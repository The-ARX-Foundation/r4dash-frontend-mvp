
import { Task } from '@/types/task';

// Mock user data
export const MOCK_USER = {
  id: 'mock-user-123',
  email: 'demo@example.com',
  name: 'Demo User'
};

export const MOCK_PROFILE = {
  id: 'mock-profile-123',
  user_id: 'mock-user-123',
  role: 'coordinator' as const,
  name: 'Demo User',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

// Mock tasks data
export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Help elderly neighbor with groceries',
    description: 'Mrs. Johnson needs help carrying groceries from the car to her apartment on the 3rd floor.',
    location: '123 Main St, Downtown',
    status: 'open',
    user_id: 'other-user-1',
    created_at: '2024-06-15T10:00:00Z',
    image_url: null,
    claimed_by: null,
    claimed_at: null,
    volunteer_id: null,
    submitted_at: null,
    verified_by: null,
    verified_at: null,
    verified: false
  },
  {
    id: 'task-2',
    title: 'Walk dogs for family in need',
    description: 'The Martinez family is dealing with a medical emergency and needs someone to walk their two golden retrievers.',
    location: '456 Oak Ave, Westside',
    status: 'claimed',
    user_id: 'other-user-2',
    created_at: '2024-06-15T09:30:00Z',
    image_url: null,
    claimed_by: 'mock-user-123',
    claimed_at: '2024-06-15T11:00:00Z',
    volunteer_id: null,
    submitted_at: null,
    verified_by: null,
    verified_at: null,
    verified: false
  },
  {
    id: 'task-3',
    title: 'Fix broken fence after storm',
    description: 'Storm knocked down part of backyard fence. Need help with repairs.',
    location: '789 Pine St, Northside',
    status: 'completed',
    user_id: 'other-user-3',
    created_at: '2024-06-14T15:00:00Z',
    image_url: null,
    claimed_by: 'volunteer-user-1',
    claimed_at: '2024-06-14T16:00:00Z',
    volunteer_id: 'volunteer-user-1',
    submitted_at: '2024-06-15T08:00:00Z',
    verified_by: null,
    verified_at: null,
    verified: false
  },
  {
    id: 'task-4',
    title: 'Deliver medications to homebound senior',
    description: 'Mr. Thompson needs his weekly medications picked up from pharmacy and delivered.',
    location: '321 Elm Dr, Southside',
    status: 'verified',
    user_id: 'other-user-4',
    created_at: '2024-06-13T12:00:00Z',
    image_url: null,
    claimed_by: 'volunteer-user-2',
    claimed_at: '2024-06-13T13:00:00Z',
    volunteer_id: 'volunteer-user-2',
    submitted_at: '2024-06-14T10:00:00Z',
    verified_by: 'mock-user-123',
    verified_at: '2024-06-15T12:00:00Z',
    verified: true
  },
  {
    id: 'task-5',
    title: 'Snow removal for disabled veteran',
    description: 'Clear driveway and walkway for wheelchair accessibility.',
    location: '654 Maple Ct, East End',
    status: 'open',
    user_id: 'other-user-5',
    created_at: '2024-06-15T08:00:00Z',
    image_url: null,
    claimed_by: null,
    claimed_at: null,
    volunteer_id: null,
    submitted_at: null,
    verified_by: null,
    verified_at: null,
    verified: false
  }
];

export const useMockAuth = () => {
  return {
    user: MOCK_USER,
    profile: MOCK_PROFILE,
    loading: false,
    signIn: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
    signOut: async () => {},
    updateProfile: async () => ({ error: null })
  };
};

export const useMockTasks = () => {
  const openTasks = MOCK_TASKS.filter(task => task.status === 'open' || task.status === 'verified');
  const userTasks = MOCK_TASKS.filter(task => 
    task.user_id === MOCK_USER.id || 
    task.claimed_by === MOCK_USER.id || 
    task.volunteer_id === MOCK_USER.id
  );
  const pendingTasks = MOCK_TASKS.filter(task => task.status === 'completed' || task.status === 'pending');

  return {
    openTasks,
    userTasks,
    pendingTasks,
    allTasks: MOCK_TASKS
  };
};

export const useMockRole = () => {
  return {
    role: 'coordinator',
    permissions: {
      canViewTasks: true,
      canCreateTasks: true,
      canClaimTasks: true,
      canMarkWellnessCheck: true,
      canLogMedicalTasks: true,
      canAccessAdmin: true,
      canVerifyTasks: true,
      canViewStats: true,
      canManageUsers: true,
    },
    hasPermission: () => true,
    isCoordinator: true,
    isMedic: false,
    isScout: false,
    isCommunicator: false,
    isVolunteer: false,
  };
};
