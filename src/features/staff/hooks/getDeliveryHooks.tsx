import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { DeliveryNote } from '../../delivery-detail/type';
import { ApiResponse } from '../../../type/api';
import { getDeliveryTable } from '../services/getAllDelivery';

export const DELIVERY_NOTES_KEY = ['delivery_all'] as const;

const getAllDelivery = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ApiResponse<DeliveryNote[]>>({
    queryKey: DELIVERY_NOTES_KEY,
    queryFn: ({ pageParam = 0 }) => getDeliveryTable(pageParam as number),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length < 5 ? undefined : allPages.length,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    deliveryNotes:
      data?.pages
        .flatMap(page => page.data)
        .filter(
          (item, index, self) =>
            self.findIndex(d => d.id === item.id) === index,
        ) ?? [],
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default getAllDelivery;
