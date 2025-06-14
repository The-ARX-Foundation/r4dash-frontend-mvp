
import { useAuth } from '@/contexts/AuthContext';
import { RolePermissions } from '@/types/auth';

export const useRole = () => {
  const { profile } = useAuth();
  
  const role = profile?.role || 'volunteer';
  
  const getPermissions = (userRole: string): RolePermissions => {
    switch (userRole) {
      case 'coordinator':
        return {
          canViewTasks: true,
          canCreateTasks: true,
          canClaimTasks: true,
          canMarkWellnessCheck: true,
          canLogMedicalTasks: true,
          canAccessAdmin: true,
          canVerifyTasks: true,
          canViewStats: true,
          canManageUsers: true,
        };
      case 'medic':
        return {
          canViewTasks: true,
          canCreateTasks: true,
          canClaimTasks: true,
          canMarkWellnessCheck: true,
          canLogMedicalTasks: true,
          canAccessAdmin: false,
          canVerifyTasks: false,
          canViewStats: false,
          canManageUsers: false,
        };
      case 'scout':
        return {
          canViewTasks: true,
          canCreateTasks: true,
          canClaimTasks: true,
          canMarkWellnessCheck: true,
          canLogMedicalTasks: false,
          canAccessAdmin: false,
          canVerifyTasks: false,
          canViewStats: false,
          canManageUsers: false,
        };
      case 'communicator':
        return {
          canViewTasks: true,
          canCreateTasks: true,
          canClaimTasks: true,
          canMarkWellnessCheck: false,
          canLogMedicalTasks: false,
          canAccessAdmin: false,
          canVerifyTasks: false,
          canViewStats: true,
          canManageUsers: false,
        };
      case 'volunteer':
      default:
        return {
          canViewTasks: true,
          canCreateTasks: true,
          canClaimTasks: true,
          canMarkWellnessCheck: false,
          canLogMedicalTasks: false,
          canAccessAdmin: false,
          canVerifyTasks: false,
          canViewStats: false,
          canManageUsers: false,
        };
    }
  };

  const permissions = getPermissions(role);
  
  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission];
  };

  return {
    role,
    permissions,
    hasPermission,
    isCoordinator: role === 'coordinator',
    isMedic: role === 'medic',
    isScout: role === 'scout',
    isCommunicator: role === 'communicator',
    isVolunteer: role === 'volunteer',
  };
};
