
import { BadgeCard } from './BadgeCard';
import { BadgeProgress } from '@/types/badge';

interface BadgeGridProps {
  badges: BadgeProgress[];
  showProgress?: boolean;
  title?: string;
}

export const BadgeGrid = ({ badges, showProgress = false, title }: BadgeGridProps) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No badges available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <BadgeCard 
            key={badge.badge_id} 
            badge={badge} 
            showProgress={showProgress}
          />
        ))}
      </div>
    </div>
  );
};
