import { supabase } from '../../../lib/supabase';
import { ApiResponse } from '../../../type/api';
import { DeliveryNote } from '../type/home';
import { DeliverySummary } from '../type/home';

export const getDeliveryTable = async (): Promise<
  ApiResponse<DeliveryNote[]>
> => {
  const { data, error } = await supabase
    .from('delivery_table')
    .select('*')
    .neq('status', 'completed')
    .order('updated_at', { ascending: false });

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

export const getDeliverySummary = async (): Promise<
  ApiResponse<DeliverySummary>
> => {
  const { data, error } = await supabase
    .from('delivery_table')
    .select('status')
    .neq('status', 'completed');

  if (error) throw { status: 500, message: error.message };

  const notes = data ?? [];
  return {
    status: 200,
    message: 'Success',
    data: {
      total_active: notes.length,
      in_transit: notes.filter(d => d.status === 'in_transit').length,
      pending: notes.filter(d => d.status === 'pending').length,
      dispatched: notes.filter(d => d.status === 'dispatched').length,
    },
  };
};
