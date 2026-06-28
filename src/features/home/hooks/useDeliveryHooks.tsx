import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '../../../type/api';
import { DeliveryNote } from '../type/home';
import { getDeliveryTable } from '../services/HomeService';

export const DELIVERY_NOTES_KEY = ['delivery_notes'] as const;

const useDeliveryTable = () => {
  const { data, isLoading, isError, error, refetch, isSuccess } = useQuery<
    ApiResponse<DeliveryNote[]>
  >({
    queryKey: DELIVERY_NOTES_KEY,
    queryFn: getDeliveryTable,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    deliveryNotes: data?.data ?? [],
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  };
};

export default useDeliveryTable;
