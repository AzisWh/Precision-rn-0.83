import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '../../../type/api';
import { DeliveryNote } from '../../delivery-detail/type';
import { DELIVERY_PAGE_SIZE } from '../../../shared/service/query';
import {
  DeliveryStatusCounts,
  getDeliverySecurityCounts,
  getDeliverySecurityList,
} from '../services/getDeliverySecurity';

export const SECURITY_DELIVERY_KEY = ['delivery_notes', 'security'] as const;

const useDeliverySecurityList = (
  activeTab: string,
  statuses: DeliveryNote['status'][],
) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ApiResponse<DeliveryNote[]>, ApiError>({
    queryKey: [...SECURITY_DELIVERY_KEY, 'list', activeTab],
    queryFn: ({ pageParam = 0 }) =>
      getDeliverySecurityList(statuses, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length < DELIVERY_PAGE_SIZE ? undefined : allPages.length,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const deliveries =
    data?.pages
      .flatMap(page => page.data)
      .filter(
        (item, index, self) => self.findIndex(d => d.id === item.id) === index,
      ) ?? [];

  return {
    deliveries,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

const useDeliverySecurityCounts = () => {
  const { data, isLoading } = useQuery<ApiResponse<DeliveryStatusCounts>, ApiError>({
    queryKey: [...SECURITY_DELIVERY_KEY, 'counts'],
    queryFn: () => getDeliverySecurityCounts(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    counts: data?.data,
    isLoading,
  };
};

export { useDeliverySecurityList, useDeliverySecurityCounts };
