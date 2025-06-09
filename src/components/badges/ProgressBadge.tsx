
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Target } from 'lucide-react';
import { BadgeProgress } from '@/types/badge';

interface ProgressBadgeProps {
  badge: BadgeProgress;
}

export const ProgressBadge = ({ badge }: ProgressBadgeProps) => {
  const progressPercentage = badge.criteria_value > 0 
    ? (badge.progress_value / badge.criteria_value) * 100 
    : 0;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {badge.is_earned ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Target className="h-5 w-5 text-blue-500" />
          )}
          <CardTitle className="text-sm font-medium">{badge.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {badge.description && (
          <p className="text-xs text-gray-600 mb-3">{badge.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">{badge.criteria}</span>
            <span className="font-medium">
              {badge.current_progress}/{badge.criteria_value}
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
          
          {badge.is_earned && badge.earned_at && (
            <p className="text-xs text-green-600 font-medium">
              Completed on {new Date(badge.earned_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
