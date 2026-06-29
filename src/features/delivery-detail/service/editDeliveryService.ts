import { supabase } from "../../../lib/supabase";
import { DELIVERY_SELECT_QUERY } from "../../../shared/service/query";
import { ApiError, ApiResponse } from "../../../type/api";
import { UpdateDeliveryInput } from "../../staff/type";
import { DeliveryNote } from "../type";


export const updateDelivery = async (
  id: string,
  req: UpdateDeliveryInput,
): Promise<ApiResponse<DeliveryNote>> => {
  const { data, error } = await supabase
    .from('delivery_table')
    .update(req)
    .eq('id', id)
    .select(DELIVERY_SELECT_QUERY)
    .single();

  if (error) {
    console.log('❌ updateDelivery error:', error.message);
    throw { status: 500, message: error.message } as ApiError;
  }

  console.log('✅ updateDelivery success:', data);
  return { status: 200, message: 'Delivery berhasil diperbarui', data: data as DeliveryNote };
};

export const deleteDelivery = async (
  id: string,
): Promise<ApiResponse<{ id: string }>> => {
  const { error } = await supabase
    .from('delivery_table')
    .delete()
    .eq('id', id);

  if (error) {
    console.log('❌ deleteDelivery error:', error.message);
    throw { status: 500, message: error.message } as ApiError;
  }

  console.log('✅ deleteDelivery success, id:', id);
  return { status: 200, message: 'Delivery berhasil dihapus', data: { id } };
};