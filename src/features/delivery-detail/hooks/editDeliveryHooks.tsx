import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '../../../type/api';
import { deleteDelivery, updateDelivery } from '../service/editDeliveryService';
import { DELIVERY_NOTES_KEY as HOME_DELIVERY_KEY } from '../../home/hooks/useDeliveryHooks';
import { DELIVERY_NOTES_KEY as STAFF_DELIVERY_KEY } from '../../staff/hooks/getDeliveryHooks';
import { UpdateDeliveryInput, UpdateDeliveryPayload } from '../../staff/type';
import { DeliveryNote } from '../type';
import { getDeliveryDetailKey } from './detailHooks';

export const useDeleteDeliveryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<{ id: string }>, ApiError, string>({
    mutationFn: id => {
      console.log('[deleteDelivery] id:', id);
      return deleteDelivery(id);
    },
    onSuccess: response => {
      console.log('[deleteDelivery] berhasil, id:', response.data.id);
      queryClient.invalidateQueries({ queryKey: HOME_DELIVERY_KEY });
      queryClient.invalidateQueries({ queryKey: STAFF_DELIVERY_KEY });
    },
    onError: error => {
      console.log('[deleteDelivery] gagal:', error.status, error.message);
    },
  });
};

export const useUpdateDeliveryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<DeliveryNote>,
    ApiError,
    UpdateDeliveryPayload
  >({
    mutationFn: ({ id, ...req }) => {
      console.log('[updateDelivery] id:', id);
      console.log('[updateDelivery] payload:', req);
      return updateDelivery(id, req);
    },
    onSuccess: response => {
      console.log('[updateDelivery] berhasil:', response.data);
      queryClient.invalidateQueries({ queryKey: HOME_DELIVERY_KEY });
      queryClient.invalidateQueries({ queryKey: STAFF_DELIVERY_KEY });
      queryClient.invalidateQueries({
        queryKey: getDeliveryDetailKey(response.data.id),
      });
    },
    onError: error => {
      console.log('[updateDelivery] gagal:', error.status, error.message);
    },
  });
};
