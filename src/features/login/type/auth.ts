export type UserRole = 'admin' | 'staff' | 'driver' | 'pic' | 'security';

export type UserProfile = {
  id: string;
  phone: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
}

export type ProfileUpdateRequest = {
  full_name?: string;
  phone?: string;
}