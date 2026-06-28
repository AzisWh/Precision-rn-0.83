import { useQuery } from '@tanstack/react-query';
import { getHistoryStats } from '../service/historyService'; 
import { ApiResponse } from '../../../type/api';
import { HistoryStats } from '../type/history';

export const HISTORY_STATS_KEY = ['history_stats'] as const;

const useHistoryStats = () => {
  const { data, isLoading, isError, refetch } = useQuery<ApiResponse<HistoryStats>>({
    queryKey: HISTORY_STATS_KEY,
    queryFn: getHistoryStats,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    stats: data?.data ?? null,
    isLoading,
    isError,
    refetch,
  };
};

export default useHistoryStats;