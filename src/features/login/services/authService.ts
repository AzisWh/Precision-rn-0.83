import { supabase } from '../../../lib/supabase';
import { LoginRequest, LoginResponse } from '../type/login';
import { UserRole } from '../type/auth';

type UserTableRow = {
  id: string;
  phone: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
};

export const loginApi = async (req: LoginRequest): Promise<LoginResponse> => {
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: `${req.phone}@app.internal`,
      password: req.password,
    });

  if (authError || !authData.session || !authData.user) {
    throw { status: 401, message: 'Nomor HP atau password salah' };
  }

  const { data, error: profileError } = await supabase
    .from('user_table')
    .select('id, phone, full_name, role, is_active')
    .eq('id', authData.user.id)
    .single();

  const profile = data as UserTableRow | null;

  if (profileError || !profile) {
    await supabase.auth.signOut();
    throw { status: 403, message: 'Profil pengguna tidak ditemukan' };
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();
    throw { status: 403, message: 'Akun tidak aktif. Hubungi administrator.' };
  }

  return {
    status: 200,
    message: 'Login berhasil',
    data: {
      token: authData.session.access_token,
      phone: profile.phone,
      role: profile.role,
      full_name: profile.full_name,
    },
  };
};

export const logoutApi = async (): Promise<void> => {
  await supabase.auth.signOut();
};
