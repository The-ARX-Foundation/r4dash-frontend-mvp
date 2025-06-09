
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Lock } from 'lucide-react';
import { BadgeProgress } from '@/types/badge';

interface BadgeCardProps {
  badge: BadgeProgress;
  showProgress?: boolean;
}

export const BadgeCard = ({ badge, showProgress = false }: BadgeCardProps) => {
  const progressPercentage = badge.criteria_value > 0 
    ? (badge.progress_value / badge.criteria_value) * 100 
    : 0;

  return (
    <Card className={`relative ${badge.is_earned ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
      <CardContent className="p-4 text-center">
        <div className="flex justify-center mb-2">
          {badge.is_earned ? (
            <CheckCircle className="h-8 w-8 text-green-500" />
          ) : (
            <Lock className="h-8 w-8 text-gray-400" />
          )}
        </div>
        
        <h3 className={`font-semibold ${badge.is_earned ? 'text-green-700' : 'text-gray-600'}`}>
          {badge.name}
        </h3>
        
        {badge.description && (
          <p className="text-sm text-gray-500 mt-1">{badge.description}</p>
        )}
        
        <p className="text-xs text-gray-400 mt-2">{badge.criteria}</p>
        
        {showProgress && !badge.is_earned && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{badge.current_progress}/{badge.criteria_value}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
        
        {badge.earned_at && (
          <Badge variant="secondary" className="mt-2 text-xs">
            Earned {new Date(badge.earned_at).toLocaleDateString()}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
