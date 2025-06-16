
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

// Mock tasks data with Texas A&M College Station locations
export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Research Assistant needed at ETB',
    description: 'Need help organizing research materials and data entry at the Engineering Technology Building. Perfect for engineering students looking to gain experience.',
    location: 'Engineering Technology Building, Texas A&M University',
    latitude: 30.6187,
    longitude: -96.3365,
    urgency: 'medium',
    skill_tags: ['technology', 'academic'],
    status: 'open',
    user_id: 'prof-user-1',
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
    title: 'Safe ride home from Northgate',
    description: 'Need a designated driver to get home safely from Hurricane Harrys to University Place Apartments after a night out. Will pay for gas!',
    location: 'Hurricane Harrys, Northgate District',
    latitude: 30.6280,
    longitude: -96.3344,
    urgency: 'high',
    skill_tags: ['physical'],
    status: 'claimed',
    user_id: 'student-user-2',
    created_at: '2024-06-15T21:30:00Z',
    image_url: null,
    claimed_by: 'mock-user-123',
    claimed_at: '2024-06-15T22:00:00Z',
    volunteer_id: null,
    submitted_at: null,
    verified_by: null,
    verified_at: null,
    verified: false
  },
  {
    id: 'task-3',
    title: 'Move dorm furniture to new apartment',
    description: 'Moving from Hullabaloo Hall to The Stack apartments. Need help loading and unloading furniture from a U-Haul truck.',
    location: 'Hullabaloo Hall, Texas A&M Campus',
    latitude: 30.6133,
    longitude: -96.3467,
    urgency: 'medium',
    skill_tags: ['physical', 'moving'],
    status: 'completed',
    user_id: 'student-user-3',
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
    title: 'Calculus tutoring at Evans Library',
    description: 'Struggling with MATH 151 and need help before my exam tomorrow. Can meet at Evans Library study rooms.',
    location: 'Evans Library, Texas A&M University',
    latitude: 30.6134,
    longitude: -96.3421,
    urgency: 'critical',
    skill_tags: ['academic', 'teaching'],
    status: 'verified',
    user_id: 'student-user-4',
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
    title: 'Dog walking while at game day',
    description: 'Going to the Aggie football game and need someone to walk my golden retriever. Live at University Crossing apartments.',
    location: 'University Crossing Apartments, College Station',
    latitude: 30.6089,
    longitude: -96.3156,
    urgency: 'low',
    skill_tags: ['pets', 'outdoor'],
    status: 'open',
    user_id: 'student-user-5',
    created_at: '2024-06-15T08:00:00Z',
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
    id: 'task-6',
    title: 'Parking assistance for MSC event',
    description: 'Big event at Memorial Student Center tonight. Need help directing traffic and parking for attendees.',
    location: 'Memorial Student Center, Texas A&M',
    latitude: 30.6126,
    longitude: -96.3417,
    urgency: 'medium',
    skill_tags: ['physical', 'outdoor'],
    status: 'open',
    user_id: 'staff-user-1',
    created_at: '2024-06-15T14:00:00Z',
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
    id: 'task-7',
    title: 'Food delivery to Zachry dorms',
    description: 'Sick with flu and can\'t leave my dorm room. Need someone to pick up food from Panda Express and deliver to Zachry Hall.',
    location: 'Zachry Hall, Texas A&M Campus',
    latitude: 30.6156,
    longitude: -96.3445,
    urgency: 'high',
    skill_tags: ['physical'],
    status: 'open',
    user_id: 'student-user-6',
    created_at: '2024-06-15T16:30:00Z',
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
    id: 'task-8',
    title: 'Study group setup at George Bush Library',
    description: 'Organizing a study group for POLS exam. Need help setting up tables and materials at the Bush Library conference room.',
    location: 'George H.W. Bush Presidential Library, College Station',
    latitude: 30.5853,
    longitude: -96.3344,
    urgency: 'low',
    skill_tags: ['academic', 'physical'],
    status: 'verified',
    user_id: 'student-user-7',
    created_at: '2024-06-14T09:00:00Z',
    image_url: null,
    claimed_by: 'volunteer-user-3',
    claimed_at: '2024-06-14T10:00:00Z',
    volunteer_id: 'volunteer-user-3',
    submitted_at: '2024-06-14T18:00:00Z',
    verified_by: 'mock-user-123',
    verified_at: '2024-06-15T09:00:00Z',
    verified: true
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
    hasPermission: (permission: string) => true,
    isCoordinator: true,
    isMedic: false,
    isScout: false,
    isCommunicator: false,
    isVolunteer: false,
  };
};
