import { supabase } from "../../../lib/supabase";
import { DELIVERY_SELECT_QUERY } from "../../../shared/service/query";
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
  .select(DELIVERY_SELECT_QUERY)
  .eq('id', id)
  .single();

  if (error) throw { status: 500, message: error.message } as ApiError;
  return { status: 200, message: 'Success', data: data as DeliveryNote };
};