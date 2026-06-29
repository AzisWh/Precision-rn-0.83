import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '../../type/api';
import { DriverOption } from '../../features/staff/type';
import { getDriverList } from '../service/getDriverService';

export const DRIVER_LIST_KEY = ['driver_list'] as const;

export const useDriverList = () => {
  const { data, isLoading, isError } = useQuery<
    ApiResponse<DriverOption[]>,
    ApiError
  >({
    queryKey: DRIVER_LIST_KEY,
    queryFn: getDriverList,
    staleTime: 1000 * 60 * 10,
  });

  return {
    drivers: data?.data ?? [],
    isLoading,
    isError,
  };
};
