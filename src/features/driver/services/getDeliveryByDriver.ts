import { supabase } from "../../../lib/supabase";
import { DELIVERY_SELECT_QUERY } from "../../../shared/service/query";
import { ApiError, ApiResponse } from "../../../type/api";
import { DeliveryNote } from "../../delivery-detail/type";


export const getMyDeliveries = async (
  driverId: string,
): Promise<ApiResponse<DeliveryNote[]>> => {
  const { data, error } = await supabase
    .from('delivery_table')
    .select(DELIVERY_SELECT_QUERY)
    .neq('status', 'completed')
    .eq('driver_id', driverId)
    .order('created_at', { ascending: false });

  if (error) {
    console.log('❌ getMyDeliveries error:', error.message);
    throw { status: 500, message: error.message } as ApiError;
  }

  console.log('✅ getMyDeliveries success:', data);
  return { status: 200, message: 'Success', data: (data as DeliveryNote[]) ?? [] };
};