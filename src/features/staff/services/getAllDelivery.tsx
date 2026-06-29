import { supabase } from '../../../lib/supabase';
import { ApiResponse } from '../../../type/api';
import { DeliveryNote } from '../../delivery-detail/type';

const PAGE_SIZE = 5;

export const getDeliveryTable = async (
  page: number,
): Promise<ApiResponse<DeliveryNote[]>> => {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('delivery_table')
    .select(
      `
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
    `,
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.log('❌ getDeliveryNotes error:', error.message);
    throw { status: 500, message: error.message };
  }

  console.log('✅ getDeliveryNotes success:', data);
  return {
    status: 200,
    message: 'Success',
    data: data ?? [],
  };
};
