import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DriverApprovalPayload } from '../../driver/type';
import { ApiError, ApiResponse } from '../../../type/api';
import { DeliveryNote } from '../type';
import { getMyDeliveriesKey } from '../../driver/hooks/getDeliveryByDriver';
import { getDeliveryDetailKey } from './detailHooks';
import {
  updateDriverApproval,
  updateSecurityApproval,
} from '../service/updateStatus';

export const useUpdateDeliveryStatusMutation = (driverId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<DeliveryNote>,
    ApiError,
    DriverApprovalPayload
  >({
    mutationFn: ({ id, ...req }) => {
      console.log('[updateDeliveryStatus] id:', id);
      console.log('[updateDeliveryStatus] payload:', req);
      return updateDriverApproval(id, req);
    },
    onSuccess: response => {
      console.log('[updateDeliveryStatus] berhasil:', response.data);
      queryClient.invalidateQueries({ queryKey: getMyDeliveriesKey(driverId) });
      queryClient.invalidateQueries({
        queryKey: getDeliveryDetailKey(response.data.id),
      });
    },
    onError: error => {
      console.log('[updateDeliveryStatus] gagal:', error.status, error.message);
    },
  });
};

export const useUpdateStatusBySecurity = (driverId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<DeliveryNote>,
    ApiError,
    DriverApprovalPayload
  >({
    mutationFn: ({ id, ...req }) => {
      console.log('[updateSecurityApproval] id:', id);
      console.log('[updateSecurityApproval] payload:', req);
      return updateSecurityApproval(id, req);
    },
    onSuccess: response => {
      console.log('[updateSecurityApproval] berhasil:', response.data);
      queryClient.invalidateQueries({ queryKey: getMyDeliveriesKey(driverId) });
      queryClient.invalidateQueries({
        queryKey: getDeliveryDetailKey(response.data.id),
      });
    },
    onError: error => {
      console.log(
        '[updateSecurityApproval] gagal:',
        error.status,
        error.message,
      );
    },
  });
};
