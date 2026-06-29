import { ProfileUpdateRequest, UserProfile } from "../../features/login/type/auth";
import { supabase } from "../../lib/supabase";
import { ApiResponse } from "../../type/api";


export const updateProfile = async (
  id: string,
  req: ProfileUpdateRequest,
): Promise<ApiResponse<UserProfile>> => {
  const { data, error } = await supabase
    .from('user_table')
    .update(req)           
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.log('❌ updateProfile error:', error.message);
    throw { status: 500, message: error.message };
  }

  console.log('✅ updateProfile success:', data);
  return { status: 200, message: 'Profil diperbarui', data: data as UserProfile };
};