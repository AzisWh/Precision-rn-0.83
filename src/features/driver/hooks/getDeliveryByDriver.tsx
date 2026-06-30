import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '../../../type/api';
import { DeliveryNote } from '../../delivery-detail/type';
import { getMyDeliveries } from '../services/getDeliveryByDriver';

export const getMyDeliveriesKey = (driverId: string) =>
  ['my_deliveries', driverId] as const;

export const useMyDeliveries = (driverId: string | undefined) => {
  const { data, isLoading, isError, error, refetch, isSuccess } = useQuery<
    ApiResponse<DeliveryNote[]>,
    ApiError
  >({
    queryKey: getMyDeliveriesKey(driverId ?? ''),
    queryFn: () => getMyDeliveries(driverId!),
    enabled: !!driverId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    deliveries: data?.data ?? [],
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  };
};
