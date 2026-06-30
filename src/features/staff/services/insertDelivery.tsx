import { supabase } from '../../../lib/supabase';
import { DELIVERY_SELECT_QUERY } from '../../../shared/service/query';
import { ApiError, ApiResponse } from '../../../type/api';
import { DeliveryNote } from '../../delivery-detail/type';
import { NewDeliveryInput } from '../type';

export const createDelivery = async (
  req: NewDeliveryInput,
): Promise<ApiResponse<DeliveryNote>> => {
  const { data, error } = await supabase
    .from('delivery_table')
    .insert(req)
    .select(DELIVERY_SELECT_QUERY)
    .single();

  if (error) {
    console.log('❌ createDelivery error:', error.message);
    throw { status: 500, message: error.message } as ApiError;
  }

  console.log('✅ createDelivery success:', data);
  return {
    status: 200,
    message: 'Delivery berhasil dibuat',
    data: data as DeliveryNote,
  };
};
