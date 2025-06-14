
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SampleDataCreator: React.FC = () => {
  const createSampleTasks = async () => {
    try {
      const sampleTasks = [
        {
          title: 'Help elderly neighbor with groceries',
          description: 'Need someone to help carry groceries from the car to the apartment on the 3rd floor. Mrs. Johnson is 85 and has trouble with heavy bags.',
          location: '123 Main Street, Apt 3B',
          user_id: crypto.randomUUID(),
          status: 'open' as const
        },
        {
          title: 'Dog walking service needed',
          description: 'Looking for someone to walk my golden retriever Max while I am at work. He is friendly and well-behaved, needs about 30 minutes of walking.',
          location: 'Oak Park neighborhood',
          user_id: crypto.randomUUID(),
          status: 'open' as const
        },
        {
          title: 'Yard cleanup assistance',
          description: 'Need help raking leaves and cleaning up the backyard before winter. Have all tools ready, just need an extra pair of hands.',
          location: '456 Elm Avenue',
          user_id: crypto.randomUUID(),
          status: 'open' as const
        },
        {
          title: 'Computer help for senior',
          description: 'My grandmother needs help setting up video calls to talk to family. Looking for someone patient to teach her how to use Zoom.',
          location: '789 Pine Street',
          user_id: crypto.randomUUID(),
          status: 'open' as const
        },
        {
          title: 'Moving furniture',
          description: 'Need help moving a couch and dining table to a new apartment. Have a truck, just need someone strong to help lift and carry.',
          location: 'Downtown area',
          user_id: crypto.randomUUID(),
          status: 'open' as const
        },
        {
          title: 'Tutoring for math homework',
          description: 'My 10-year-old needs help with 4th grade math homework. Looking for someone patient and good with kids.',
          location: 'Riverside Elementary area',
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
      toast.success(`Successfully created ${data.length} sample tasks!`);
    } catch (error) {
      console.error('Error creating sample tasks:', error);
      toast.error('Failed to create sample tasks');
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sample Data</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={createSampleTasks} className="w-full">
          Add Sample Tasks
        </Button>
      </CardContent>
    </Card>
  );
};

export default SampleDataCreator;
