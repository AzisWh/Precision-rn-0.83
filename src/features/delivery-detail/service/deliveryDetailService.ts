import { supabase } from "../../../lib/supabase";
import { ApiError, ApiResponse } from "../../../type/api";
import { DeliveryNote } from "../type";


// export const getDeliveryDetail = async (id: string): Promise<ApiResponse<DeliveryNote>> => {
//   const { data, error } = await supabase
//     .from('delivery_table')
//     .select('*')
//     .eq('id', id)
//     .single();
//   if (error) throw { status: 500, message: error.message } as ApiError;
//   return { status: 200, message: 'Success', data: data as DeliveryNote };
// };

export const getDeliveryDetail = async (id: string): Promise<ApiResponse<DeliveryNote>> => {
  const { data, error } = await supabase
  .from('delivery_table')
  .select(`
    *,
    driver:user_table!delivery_table_driver_id_fkey(
      id,
      full_name,
      phone,
      detail:drivers!drivers_user_id_fkey(
        vehicle_type,
        driver_lat,
        driver_lng,
        last_location_update
      )
    )
  `)
  .eq('id', id)
  .single();

  if (error) throw { status: 500, message: error.message } as ApiError;
  return { status: 200, message: 'Success', data: data as DeliveryNote };
};