import { useQuery } from '@tanstack/react-query';
import { getDeliverySummary } from '../services/HomeService';

export const DELIVERY_SUMMARY_KEY = ['delivery_summary'] as const;

const useDeliverySummary = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: DELIVERY_SUMMARY_KEY,
    queryFn: getDeliverySummary,
    staleTime: 1000 * 60 * 5,
  });

  return {
    summary: data?.data ?? null,
    isLoading,
    isError,
    refetch,
  };
};

export default useDeliverySummary;
