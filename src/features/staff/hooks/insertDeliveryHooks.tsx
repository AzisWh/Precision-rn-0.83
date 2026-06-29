import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDelivery } from "../services/insertDelivery";
import { NewDeliveryInput } from "../type";
import { ApiError, ApiResponse } from "../../../type/api";
import { DeliveryNote } from "../../delivery-detail/type";
import { DELIVERY_NOTES_KEY } from "./getDeliveryHooks";

export const useCreateDeliveryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<DeliveryNote>, ApiError, NewDeliveryInput>({
    mutationFn: (req) => {
      console.log('[createDelivery] payload:', req);
      return createDelivery(req);
    },
    onSuccess: (response) => {
      console.log('[createDelivery] berhasil:', response.data);
      queryClient.invalidateQueries({ queryKey: DELIVERY_NOTES_KEY });
    },
    onError: (error) => {
      console.log('[createDelivery] gagal:', error.status, error.message);
    },
  });
};