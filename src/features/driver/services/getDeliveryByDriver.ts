import { supabase } from "../../../lib/supabase";
import {
  DELIVERY_PAGE_SIZE,
  DELIVERY_SELECT_QUERY,
} from "../../../shared/service/query";
import { ApiError, ApiResponse } from "../../../type/api";
import { DeliveryNote } from "../../delivery-detail/type";

export type DeliveryStatusCounts = Record<DeliveryNote["status"], number>;

const emptyCounts = (): DeliveryStatusCounts => ({
  pending: 0,
  in_transit: 0,
  arrived: 0,
  completed: 0,
  rejected: 0,
});

export const getMyDeliveriesList = async (
  driverId: string,
  statuses: DeliveryNote["status"][],
  page: number,
): Promise<ApiResponse<DeliveryNote[]>> => {
  const from = page * DELIVERY_PAGE_SIZE;
  const to = from + DELIVERY_PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from("delivery_table")
    .select(DELIVERY_SELECT_QUERY)
    .eq("driver_id", driverId)
    .neq("status", "completed")
    .in("status", statuses)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.log("❌ getMyDeliveriesList error:", error.message);
    throw { status: 500, message: error.message } as ApiError;
  }

  return {
    status: 200,
    message: "Success",
    data: (data as DeliveryNote[]) ?? [],
  };
};

export const getMyDeliveriesCounts = async (
  driverId: string,
): Promise<ApiResponse<DeliveryStatusCounts>> => {
  const { data, error } = await supabase
    .from("delivery_table")
    .select("status")
    .eq("driver_id", driverId)
    .neq("status", "completed");

  if (error) {
    console.log("❌ getMyDeliveriesCounts error:", error.message);
    throw { status: 500, message: error.message } as ApiError;
  }

  const counts = emptyCounts();
  for (const row of data ?? []) {
    const status = row.status as DeliveryNote["status"];
    if (status in counts) counts[status] += 1;
  }

  return { status: 200, message: "Success", data: counts };
};
