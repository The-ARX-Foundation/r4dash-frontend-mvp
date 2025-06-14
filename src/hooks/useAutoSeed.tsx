
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAutoSeed = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);

  const checkIfDataExists = async () => {
    try {
      console.log('Checking if data exists...');
      const [tasksResult, badgesResult] = await Promise.all([
        supabase.from('tasks').select('id', { count: 'exact', head: true }),
        supabase.from('badges').select('id', { count: 'exact', head: true })
      ]);

      console.log('Tasks count:', tasksResult.count);
      console.log('Badges count:', badgesResult.count);

      if (tasksResult.error) {
        console.error('Error checking tasks:', tasksResult.error);
      }
      if (badgesResult.error) {
        console.error('Error checking badges:', badgesResult.error);
      }

      const hasData = (tasksResult.count && tasksResult.count > 0) || 
                     (badgesResult.count && badgesResult.count > 0);
      
      return hasData;
    } catch (error) {
      console.error('Error checking existing data:', error);
      return true; // Assume data exists to avoid seeding on error
    }
  };

  const seedSampleData = async () => {
    setIsSeeding(true);
    console.log('Starting to seed sample data...');
    
    try {
      // Generate consistent UUIDs for sample users
      const generateUserId = (index: number) => `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`;

      // Seed tasks with more 'open' status tasks (8 open tasks for easy browsing)
      const sampleTasks = [
        {
          title: 'Help elderly neighbor with groceries',
          description: 'Need someone to help carry groceries from the car to the apartment on the 3rd floor. Mrs. Johnson is 85 and has trouble with heavy bags.',
          location: 'Upper East Side, Manhattan, NYC',
          latitude: 40.7739,
          longitude: -73.9554,
          urgency: 'high',
          skill_tags: ['physical', 'elderly-care'],
          user_id: generateUserId(1),
          status: 'open' as const
        },
        {
          title: 'Dog walking service needed',
          description: 'Looking for someone to walk my golden retriever Max while I am at work. He is friendly and well-behaved, needs about 30 minutes of walking.',
          location: 'Central Park area, Manhattan, NYC',
          latitude: 40.7829,
          longitude: -73.9654,
          urgency: 'medium',
          skill_tags: ['pets', 'outdoor'],
          user_id: generateUserId(2),
          status: 'open' as const
        },
        {
          title: 'Computer help for senior',
          description: 'My grandmother needs help setting up video calls to talk to family. Looking for someone patient to teach her how to use Zoom.',
          location: 'Brooklyn Heights, NYC',
          latitude: 40.6962,
          longitude: -73.9932,
          urgency: 'medium',
          skill_tags: ['technology', 'teaching', 'elderly-care'],
          user_id: generateUserId(3),
          status: 'open' as const
        },
        {
          title: 'Moving furniture urgently',
          description: 'Need help moving a couch and dining table to a new apartment. Have a truck, just need someone strong to help lift and carry.',
          location: 'Queens, NYC',
          latitude: 40.7282,
          longitude: -73.7949,
          urgency: 'critical',
          skill_tags: ['physical', 'moving'],
          user_id: generateUserId(4),
          status: 'open' as const
        },
        {
          title: 'Tutoring for math homework',
          description: 'My 10-year-old needs help with 4th grade math homework. Looking for someone patient and good with kids.',
          location: 'Beverly Hills, CA',
          latitude: 34.0736,
          longitude: -118.4004,
          urgency: 'medium',
          skill_tags: ['teaching', 'academic', 'children'],
          user_id: generateUserId(5),
          status: 'open' as const
        },
        {
          title: 'Yard cleanup assistance',
          description: 'Need help raking leaves and cleaning up the backyard. Have all tools ready, just need an extra pair of hands.',
          location: 'Santa Monica, CA',
          latitude: 34.0195,
          longitude: -118.4912,
          urgency: 'low',
          skill_tags: ['physical', 'outdoor', 'gardening'],
          user_id: generateUserId(6),
          status: 'open' as const
        },
        {
          title: 'Emergency childcare needed',
          description: 'Single parent needs urgent childcare for 6-year-old due to family emergency. Child is well-behaved and easy-going.',
          location: 'Richmond District, San Francisco, CA',
          latitude: 37.7806,
          longitude: -122.4644,
          urgency: 'critical',
          skill_tags: ['childcare', 'emergency'],
          user_id: generateUserId(7),
          status: 'open' as const
        },
        {
          title: 'Tech setup for nonprofit',
          description: 'Small nonprofit needs help setting up new computers and network equipment. Looking for someone with IT experience.',
          location: 'Mission District, San Francisco, CA',
          latitude: 37.7599,
          longitude: -122.4148,
          urgency: 'medium',
          skill_tags: ['technology', 'nonprofit', 'networking'],
          user_id: generateUserId(8),
          status: 'open' as const
        },
        {
          title: 'Wellness check for elderly resident',
          description: 'Regular wellness check needed for Mrs. Thompson who lives alone. Just need someone to visit and ensure she is okay.',
          location: 'Back Bay, Boston, MA',
          latitude: 42.3505,
          longitude: -71.0753,
          urgency: 'low',
          skill_tags: ['wellness-check', 'elderly-care'],
          user_id: generateUserId(9),
          status: 'verified' as const,
          wellness_check: true
        },
        {
          title: 'Food prep volunteer for shelter',
          description: 'Local homeless shelter needs help preparing and serving meals. Great way to give back to the community.',
          location: 'South End, Boston, MA',
          latitude: 42.3398,
          longitude: -71.0691,
          urgency: 'medium',
          skill_tags: ['cooking', 'community-service', 'volunteer'],
          user_id: generateUserId(10),
          status: 'verified' as const
        }
      ];

      // Seed badges
      const sampleBadges = [
        {
          name: 'Community Helper',
          description: 'Complete 5 community service tasks',
          icon: '🤝',
          criteria: 'Complete community service tasks',
          criteria_type: 'task_count',
          criteria_value: 5
        },
        {
          name: 'Senior Support',
          description: 'Help 3 elderly community members',
          icon: '👵',
          criteria: 'Complete elderly care tasks',
          criteria_type: 'skill_tag',
          criteria_value: 3
        },
        {
          name: 'Tech Wizard',
          description: 'Complete 10 technology-related tasks',
          icon: '💻',
          criteria: 'Complete technology tasks',
          criteria_type: 'skill_tag',
          criteria_value: 10
        },
        {
          name: 'Emergency Responder',
          description: 'Complete 3 critical urgency tasks',
          icon: '🚨',
          criteria: 'Complete critical tasks',
          criteria_type: 'urgency',
          criteria_value: 3
        }
      ];

      console.log('Attempting to insert tasks and badges...');
      
      const [tasksResult, badgesResult] = await Promise.all([
        supabase.from('tasks').insert(sampleTasks),
        supabase.from('badges').insert(sampleBadges)
      ]);

      console.log('Tasks insert result:', tasksResult);
      console.log('Badges insert result:', badgesResult);

      if (tasksResult.error) {
        console.error('Error seeding tasks:', tasksResult.error);
        toast.error(`Failed to create sample tasks: ${tasksResult.error.message}`);
      }
      if (badgesResult.error) {
        console.error('Error seeding badges:', badgesResult.error);
        toast.error(`Failed to create sample badges: ${badgesResult.error.message}`);
      }

      if (!tasksResult.error && !badgesResult.error) {
        setIsSeeded(true);
        toast.success('Sample data loaded successfully! 8 tasks are now available to browse and claim.');
        console.log('Sample data seeded successfully');
      } else if (!tasksResult.error) {
        setIsSeeded(true);
        toast.success('Sample tasks created successfully! 8 tasks are now available to browse.');
        console.log('Sample tasks seeded successfully');
      } else {
        toast.error('Failed to load sample data. You can still use the platform.');
        console.error('Failed to seed sample data');
      }
    } catch (error) {
      console.error('Error seeding sample data:', error);
      toast.error(`Failed to load sample data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const manualReseed = async () => {
    console.log('Manual reseed requested');
    await seedSampleData();
  };

  useEffect(() => {
    const initializeData = async () => {
      console.log('Initializing data...');
      const hasData = await checkIfDataExists();
      console.log('Has existing data:', hasData);
      
      if (!hasData) {
        console.log('No existing data found, seeding...');
        await seedSampleData();
      } else {
        console.log('Data already exists, skipping seed');
        setIsSeeded(true);
      }
    };

    initializeData();
  }, []);

  return { isSeeding, isSeeded, manualReseed };
};
