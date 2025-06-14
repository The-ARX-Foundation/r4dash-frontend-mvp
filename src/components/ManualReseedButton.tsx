
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAutoSeed } from '@/hooks/useAutoSeed';

const ManualReseedButton: React.FC = () => {
  const { manualReseed, isSeeding } = useAutoSeed();

  return (
    <Button
      onClick={manualReseed}
      disabled={isSeeding}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <RefreshCw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
      {isSeeding ? 'Reseeding...' : 'Reseed Data'}
    </Button>
  );
};

export default ManualReseedButton;
