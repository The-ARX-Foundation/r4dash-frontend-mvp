
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAutoSeed = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);

  const checkIfDataExists = async () => {
    try {
      const [tasksResult, badgesResult] = await Promise.all([
        supabase.from('tasks').select('id', { count: 'exact', head: true }),
        supabase.from('badges').select('id', { count: 'exact', head: true })
      ]);

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
    try {
      // Seed tasks
      const sampleTasks = [
        {
          title: 'Help elderly neighbor with groceries',
          description: 'Need someone to help carry groceries from the car to the apartment on the 3rd floor. Mrs. Johnson is 85 and has trouble with heavy bags.',
          location: 'Upper East Side, Manhattan, NYC',
          latitude: 40.7739,
          longitude: -73.9554,
          urgency: 'high',
          skill_tags: ['physical', 'elderly-care'],
          user_id: crypto.randomUUID(),
          status: 'verified' as const
        },
        {
          title: 'Dog walking service needed',
          description: 'Looking for someone to walk my golden retriever Max while I am at work. He is friendly and well-behaved, needs about 30 minutes of walking.',
          location: 'Central Park area, Manhattan, NYC',
          latitude: 40.7829,
          longitude: -73.9654,
          urgency: 'medium',
          skill_tags: ['pets', 'outdoor'],
          user_id: crypto.randomUUID(),
          status: 'pending' as const
        },
        {
          title: 'Computer help for senior',
          description: 'My grandmother needs help setting up video calls to talk to family. Looking for someone patient to teach her how to use Zoom.',
          location: 'Brooklyn Heights, NYC',
          latitude: 40.6962,
          longitude: -73.9932,
          urgency: 'medium',
          skill_tags: ['technology', 'teaching', 'elderly-care'],
          user_id: crypto.randomUUID(),
          status: 'verified' as const
        },
        {
          title: 'Emergency childcare needed',
          description: 'Single parent needs urgent childcare for 6-year-old due to family emergency. Child is well-behaved and easy-going.',
          location: 'Richmond District, San Francisco, CA',
          latitude: 37.7806,
          longitude: -122.4644,
          urgency: 'critical',
          skill_tags: ['childcare', 'emergency'],
          user_id: crypto.randomUUID(),
          status: 'pending' as const
        },
        {
          title: 'Wellness check for elderly resident',
          description: 'Regular wellness check needed for Mrs. Thompson who lives alone. Just need someone to visit and ensure she is okay.',
          location: 'Back Bay, Boston, MA',
          latitude: 42.3505,
          longitude: -71.0753,
          urgency: 'low',
          skill_tags: ['wellness-check', 'elderly-care'],
          user_id: crypto.randomUUID(),
          status: 'open' as const,
          wellness_check: true
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

      const [tasksResult, badgesResult] = await Promise.all([
        supabase.from('tasks').insert(sampleTasks),
        supabase.from('badges').insert(sampleBadges)
      ]);

      if (tasksResult.error) {
        console.error('Error seeding tasks:', tasksResult.error);
      }
      if (badgesResult.error) {
        console.error('Error seeding badges:', badgesResult.error);
      }

      if (!tasksResult.error && !badgesResult.error) {
        setIsSeeded(true);
        toast.success('Sample data loaded successfully! Explore the platform with realistic tasks and badges.');
      } else {
        toast.error('Some sample data failed to load, but you can still use the platform.');
      }
    } catch (error) {
      console.error('Error seeding sample data:', error);
      toast.error('Failed to load sample data, but you can still use the platform.');
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const hasData = await checkIfDataExists();
      if (!hasData) {
        await seedSampleData();
      } else {
        setIsSeeded(true);
      }
    };

    initializeData();
  }, []);

  return { isSeeding, isSeeded };
};
