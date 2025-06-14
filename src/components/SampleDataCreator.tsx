
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SampleDataCreator: React.FC = () => {
  const createSampleTasks = async () => {
    try {
      const sampleTasks = [
        // New York City area tasks
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
          title: 'Moving furniture urgently',
          description: 'Need help moving a couch and dining table to a new apartment TODAY. Have a truck, just need someone strong to help lift and carry.',
          location: 'Queens, NYC',
          latitude: 40.7282,
          longitude: -73.7949,
          urgency: 'critical',
          skill_tags: ['physical', 'moving'],
          user_id: crypto.randomUUID(),
          status: 'pending' as const
        },
        
        // Los Angeles area tasks
        {
          title: 'Yard cleanup assistance',
          description: 'Need help raking leaves and cleaning up the backyard before winter. Have all tools ready, just need an extra pair of hands.',
          location: 'Santa Monica, CA',
          latitude: 34.0195,
          longitude: -118.4912,
          urgency: 'low',
          skill_tags: ['physical', 'outdoor', 'gardening'],
          user_id: crypto.randomUUID(),
          status: 'verified' as const
        },
        {
          title: 'Tutoring for math homework',
          description: 'My 10-year-old needs help with 4th grade math homework. Looking for someone patient and good with kids.',
          location: 'Beverly Hills, CA',
          latitude: 34.0736,
          longitude: -118.4004,
          urgency: 'medium',
          skill_tags: ['teaching', 'academic', 'children'],
          user_id: crypto.randomUUID(),
          status: 'open' as const
        },
        
        // Chicago area tasks
        {
          title: 'Snow removal help needed',
          description: 'Elderly couple needs help clearing snow from driveway and walkway. Tools provided, just need strong arms!',
          location: 'Lincoln Park, Chicago, IL',
          latitude: 41.9342,
          longitude: -87.6431,
          urgency: 'high',
          skill_tags: ['physical', 'outdoor', 'elderly-care'],
          user_id: crypto.randomUUID(),
          status: 'verified' as const
        },
        {
          title: 'Food delivery volunteer',
          description: 'Local food bank needs volunteers to deliver meals to homebound seniors. Must have reliable transportation.',
          location: 'Downtown Chicago, IL',
          latitude: 41.8781,
          longitude: -87.6298,
          urgency: 'medium',
          skill_tags: ['driving', 'community-service', 'elderly-care'],
          user_id: crypto.randomUUID(),
          status: 'pending' as const
        },
        
        // San Francisco area tasks
        {
          title: 'Tech setup for nonprofit',
          description: 'Small nonprofit needs help setting up new computers and network equipment. Looking for someone with IT experience.',
          location: 'Mission District, San Francisco, CA',
          latitude: 37.7599,
          longitude: -122.4148,
          urgency: 'medium',
          skill_tags: ['technology', 'nonprofit', 'networking'],
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
        
        // Boston area tasks
        {
          title: 'Elderly companion needed',
          description: 'Looking for someone to spend time with my 78-year-old father. He enjoys conversation and light activities.',
          location: 'Back Bay, Boston, MA',
          latitude: 42.3505,
          longitude: -71.0753,
          urgency: 'low',
          skill_tags: ['companionship', 'elderly-care'],
          user_id: crypto.randomUUID(),
          status: 'verified' as const
        },
        {
          title: 'Food prep volunteer for shelter',
          description: 'Local homeless shelter needs help preparing and serving meals. Great way to give back to the community.',
          location: 'South End, Boston, MA',
          latitude: 42.3398,
          longitude: -71.0691,
          urgency: 'medium',
          skill_tags: ['cooking', 'community-service', 'volunteer'],
          user_id: crypto.randomUUID(),
          status: 'open' as const
        }
      ];

      const { data, error } = await supabase
        .from('tasks')
        .insert(sampleTasks)
        .select();

      if (error) {
        console.error('Error creating sample tasks:', error);
        toast.error('Failed to create sample tasks');
        return;
      }

      console.log('Sample tasks created:', data);
      toast.success(`Successfully created ${data.length} sample tasks with coordinates!`);
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
        toast.error('Failed to create sample badges');
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
        <CardTitle>Sample Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={createSampleTasks} className="w-full">
          Add Sample Tasks with Coordinates
        </Button>
        <Button onClick={createSampleBadges} variant="outline" className="w-full">
          Add Sample Badges
        </Button>
      </CardContent>
    </Card>
  );
};

export default SampleDataCreator;
