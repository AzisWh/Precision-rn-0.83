import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../features/login/type/auth';

export const useRole = () => {
  const { auth } = useAuth();
  const role = auth.role;

  return {
    role,
    isAdmin: role === 'admin',
    isStaff: role === 'staff',
    isDriver: role === 'driver',
    isPic: role === 'pic',
    isSecurity: role === 'security',
    hasRole: (allowed: UserRole[]) => role !== null && allowed.includes(role),
  };
};
