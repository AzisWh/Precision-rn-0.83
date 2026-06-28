import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '../../../type/api';
import { DeliveryNote } from '../../home/type/home';
import { getHistoryDN } from '../service/historyService';

export const DELIVERY_NOTES_KEY = ['history_dn'] as const;

const useHistoryTable = () => {
  const { data, isLoading, isError, error, refetch, isSuccess } = useQuery<
    ApiResponse<DeliveryNote[]>
  >({
    queryKey: DELIVERY_NOTES_KEY,
    queryFn: getHistoryDN,
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

export default useHistoryTable;
