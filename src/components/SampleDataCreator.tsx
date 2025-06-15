
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const SampleDataCreator: React.FC = () => {
  const { user } = useAuth();

  const createSampleTasks = async () => {
    if (!user) {
      toast.error('Must be logged in to create sample tasks');
      return;
    }

    try {
      const sampleTasks = [
        // Use current user's ID for all sample tasks
        {
          title: 'Help elderly neighbor with groceries',
          description: 'Need someone to help carry groceries from the car to the apartment on the 3rd floor. Mrs. Johnson is 85 and has trouble with heavy bags.',
          location: 'Upper East Side, Manhattan, NYC',
          latitude: 40.7739,
          longitude: -73.9554,
          urgency: 'high',
          skill_tags: ['physical', 'elderly-care'],
          user_id: user.id,
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
          user_id: user.id,
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
          user_id: user.id,
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
          user_id: user.id,
          status: 'open' as const
        },
        {
          title: 'Yard cleanup assistance',
          description: 'Need help raking leaves and cleaning up the backyard before winter. Have all tools ready, just need an extra pair of hands.',
          location: 'Santa Monica, CA',
          latitude: 34.0195,
          longitude: -118.4912,
          urgency: 'low',
          skill_tags: ['physical', 'outdoor', 'gardening'],
          user_id: user.id,
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
          user_id: user.id,
          status: 'completed' as const
        },
        {
          title: 'Wellness check for elderly resident',
          description: 'Regular wellness check needed for Mrs. Thompson who lives alone. Just need someone to visit and ensure she is okay.',
          location: 'Back Bay, Boston, MA',
          latitude: 42.3505,
          longitude: -71.0753,
          urgency: 'low',
          skill_tags: ['wellness-check', 'elderly-care'],
          user_id: user.id,
          status: 'pending' as const,
          wellness_check: true
        }
      ];

      const { data, error } = await supabase
        .from('tasks')
        .insert(sampleTasks)
        .select();

      if (error) {
        console.error('Error creating sample tasks:', error);
        toast.error('Failed to create sample tasks: ' + error.message);
        return;
      }

      console.log('Sample tasks created:', data);
      toast.success(`Successfully created ${data.length} sample tasks!`);
    } catch (error) {
      console.error('Error creating sample tasks:', error);
      toast.error('Failed to create sample tasks');
    }
  };

  const createSampleBadges = async () => {
    try {
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
        },
        {
          name: 'Neighborhood Champion',
          description: 'Complete 20 tasks in your area',
          icon: '🏆',
          criteria: 'Complete local tasks',
          criteria_type: 'task_count',
          criteria_value: 20
        }
      ];

      const { data, error } = await supabase
        .from('badges')
        .insert(sampleBadges)
        .select();

      if (error) {
        console.error('Error creating sample badges:', error);
        toast.error('Failed to create sample badges: ' + error.message);
        return;
      }

      console.log('Sample badges created:', data);
      toast.success(`Successfully created ${data.length} sample badges!`);
    } catch (error) {
      console.error('Error creating sample badges:', error);
      toast.error('Failed to create sample badges');
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sample Data Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={createSampleTasks} className="w-full">
          Create Sample Tasks (Uses Your User ID)
        </Button>
        <Button onClick={createSampleBadges} variant="outline" className="w-full">
          Create Sample Badges
        </Button>
        <p className="text-xs text-gray-500">
          These tools create sample data using your current user account to avoid foreign key errors.
        </p>
      </CardContent>
    </Card>
  );
};

export default SampleDataCreator;
