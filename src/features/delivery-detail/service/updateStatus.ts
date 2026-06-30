import { supabase } from "../../../lib/supabase";
import { DELIVERY_SELECT_QUERY } from "../../../shared/service/query";
import { ApiError, ApiResponse } from "../../../type/api";
import { DeliveryNote } from "../type";
import { DriverApproval } from "../../driver/type";
import { RejectRequest } from "../../security/type";
import { CompletedRequest } from "../../pic/type";

export const updateDriverApproval = async (
  id: string,
  req: DriverApproval,
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

export const updateSecurityApproval = async (
  id: string,
  req: DriverApproval,
): Promise<ApiResponse<DeliveryNote>> => {
  const { data, error } = await supabase
    .from('delivery_table')
    .update(req)
    .eq('id', id)
    .select(DELIVERY_SELECT_QUERY)
    .single();

  if (error) {
    console.log('❌ updateSecurityApproval error:', error.message);
    throw { status: 500, message: error.message } as ApiError;
  }

  console.log('✅ updateSecurityApproval success:', data);
  return { status: 200, message: 'Delivery berhasil diperbarui', data: data as DeliveryNote };
};

export const updateRejectRequest = async (
  id: string,
  req: RejectRequest,
): Promise<ApiResponse<DeliveryNote>> => {
  const { data, error } = await supabase
    .from('delivery_table')
    .update(req)
    .eq('id', id)
    .select(DELIVERY_SELECT_QUERY)
    .single();

  if (error) {
    console.log('❌ updateRejectRequest error:', error.message);
    throw { status: 500, message: error.message } as ApiError;
  }

  console.log('✅ updateRejectRequest success:', data);
  return { status: 200, message: 'Delivery berhasil diperbarui', data: data as DeliveryNote };
}

export const updateCompleteRequest = async (
  id: string,
  req: CompletedRequest,
): Promise<ApiResponse<DeliveryNote>> => {
  const { data, error } = await supabase
    .from('delivery_table')
    .update(req)
    .eq('id', id)
    .select(DELIVERY_SELECT_QUERY)
    .single();

  if (error) {
    console.log('❌ updateCompleteRequest error:', error.message);
    throw { status: 500, message: error.message } as ApiError;
  }

  console.log('✅ updateCompleteRequest success:', data);
  return { status: 200, message: 'Delivery berhasil diperbarui', data: data as DeliveryNote };
}