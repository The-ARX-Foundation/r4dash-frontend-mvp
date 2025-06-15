
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const { user, profile, loading } = useAuth();
  const { hasPermission } = useRole();
  const location = useLocation();

  console.log('ProtectedRoute - user:', user?.id, 'profile:', profile?.role, 'loading:', loading);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if no user
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // TEMPORARY BYPASS: Skip all role selection logic
  // TODO: Re-implement role selection with proper state management
  // Steps for re-implementation:
  // 1. Fix profile fetching race condition in AuthContext
  // 2. Implement proper role selection flow with better state management  
  // 3. Add role request system for coordinator access
  // 4. Re-enable role selection route with proper guards
  // 5. Add admin interface for role management
  
  // For now, if user exists but no profile, AuthContext will auto-create one
  // This prevents any redirect loops to role-selection

  // Check permissions if required
  if (requiredPermission && profile) {
    if (!hasPermission(requiredPermission as any)) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
