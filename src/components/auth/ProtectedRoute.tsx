
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

  // If user exists but no profile, redirect to role selection
  // But skip this for role-selection page itself to avoid infinite loop
  if (!profile && location.pathname !== '/role-selection') {
    console.log('No profile found, redirecting to role selection');
    return <Navigate to="/role-selection" replace />;
  }

  // If we're on role-selection page and user has a profile, redirect to home
  if (location.pathname === '/role-selection' && profile) {
    console.log('Profile exists, redirecting from role selection to home');
    return <Navigate to="/" replace />;
  }

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
