export type UserRole = 'admin' | 'staff' | 'driver' | 'pic' | 'security';

export interface UserProfile {
  id: string;
  phone: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
}