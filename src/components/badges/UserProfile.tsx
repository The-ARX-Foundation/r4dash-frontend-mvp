
import { useEarnedBadges, useAvailableBadges } from '@/hooks/useBadges';
import { BadgeGrid } from './BadgeGrid';
import { ProgressBadge } from './ProgressBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserProfileProps {
  userId: string;
}

export const UserProfile = ({ userId }: UserProfileProps) => {
  const { data: earnedBadges = [], isLoading: earnedLoading } = useEarnedBadges(userId);
  const { data: availableBadges = [], isLoading: availableLoading } = useAvailableBadges(userId);

  if (earnedLoading || availableLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Badge Progress</span>
            <span className="text-sm font-normal text-gray-500">
              ({earnedBadges.length} earned)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="earned" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="earned">
                Earned Badges ({earnedBadges.length})
              </TabsTrigger>
              <TabsTrigger value="available">
                Available Badges ({availableBadges.length})
              </TabsTrigger>
              <TabsTrigger value="progress">
                Progress View
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="earned" className="mt-6">
              <BadgeGrid 
                badges={earnedBadges} 
                title="Your Earned Badges"
              />
            </TabsContent>
            
            <TabsContent value="available" className="mt-6">
              <BadgeGrid 
                badges={availableBadges} 
                showProgress={true}
                title="Available Badges"
              />
            </TabsContent>
            
            <TabsContent value="progress" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Detailed Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableBadges.map((badge) => (
                    <ProgressBadge key={badge.badge_id} badge={badge} />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
