import { UserProfile } from "../../features/login/type/auth";
import { supabase } from "../../lib/supabase";
import { ApiError, ApiResponse } from "../../type/api";


export const getMyProfile = async (): Promise<ApiResponse<UserProfile>> => {
  
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log('❌ getMyProfile: belum login');
    throw { status: 401, message: 'Belum login' } as ApiError;
  }

  const { data, error } = await supabase
    .from('user_table')
    .select('id, phone, full_name, role, is_active')
    .eq('id', user.id)       
    .single();               

  if (error || !data) {
    console.log('❌ getMyProfile error:', error?.message);
    throw { status: 404, message: 'Profil tidak ditemukan' } as ApiError;
  }

  console.log('getMyProfile success:', data);
  return { status: 200, message: 'Profil ditemukan', data: data as UserProfile };
};