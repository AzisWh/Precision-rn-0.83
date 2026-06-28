import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../../type/api";
import { DeliveryNote } from "../type";
import { getDeliveryDetail } from "../service/deliveryDetailService";

export const getDeliveryDetailKey = (id: string) => ['delivery_detail', id] as const;

const useDeliveryDetail = (id: string | undefined) => {
  const { data, isLoading, isError, error, refetch, isSuccess } =
    useQuery<ApiResponse<DeliveryNote>>({
      queryKey: getDeliveryDetailKey(id ?? ''),
      queryFn: () => getDeliveryDetail(id!),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });
  return { deliveryDetail: data?.data, isLoading, isSuccess, isError, error, refetch };
};
export default useDeliveryDetail;