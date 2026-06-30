import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '../../../type/api';
import { DeliveryNote } from '../../delivery-detail/type';
import { DELIVERY_PAGE_SIZE } from '../../../shared/service/query';
import {
  DeliveryStatusCounts,
  getDeliveryPicCounts,
  getDeliveryPicList,
} from '../services/getDeliveryPic';

export const PIC_DELIVERY_KEY = ['delivery_notes', 'pic'] as const;

const useDeliveryPicList = (
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
    queryKey: [...PIC_DELIVERY_KEY, 'list', activeTab],
    queryFn: ({ pageParam = 0 }) =>
      getDeliveryPicList(statuses, pageParam as number),
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

const useDeliveryPicCounts = () => {
  const { data, isLoading } = useQuery<ApiResponse<DeliveryStatusCounts>, ApiError>({
    queryKey: [...PIC_DELIVERY_KEY, 'counts'],
    queryFn: () => getDeliveryPicCounts(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    counts: data?.data,
    isLoading,
  };
};

export { useDeliveryPicList, useDeliveryPicCounts };
