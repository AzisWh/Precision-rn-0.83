import { DriverOption } from "../../features/staff/type";
import { supabase } from "../../lib/supabase";
import { ApiError, ApiResponse } from "../../type/api";


export const getDriverList = async (): Promise<ApiResponse<DriverOption[]>> => {
  const { data, error } = await supabase
    .from('user_table')
    .select('id, full_name, phone')
    .eq('role', 'driver')
    .eq('is_active', true);

  if (error) {
    console.log('❌ getDriverList error:', error.message);
    throw { status: 500, message: error.message } as ApiError;
  }

  console.log('✅ getDriverList success:', data);
  return { status: 200, message: 'Success', data: data as DriverOption[] };
};