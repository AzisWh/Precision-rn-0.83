import { supabase } from "../../../lib/supabase";
import { ApiResponse } from "../../../type/api";
import { DeliveryNote } from "../../home/type/home";
import { HistoryStats } from "../type/history";

export const getHistoryDN = async (): Promise<ApiResponse<DeliveryNote[]>> => {
  const { data, error } = await supabase
    .from('delivery_table')
    .select('*')
    .eq('status', 'completed') 
    .order('updated_at', { ascending: false });

  if (error) throw { status: 500, message: error.message };

  console.log('Fetched history delivery notes:', data);

  return {
    status: 200,
    message: 'Success',
    data: data ?? [],
  };
};


export const getHistoryStats = async (): Promise<ApiResponse<HistoryStats>> => {
  const now = new Date();

  // this month
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

  // last month
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

  const { count: thisMonthCount, error: e1 } = await supabase
    .from('delivery_table')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('updated_at', thisMonthStart)
    .lt('updated_at', nextMonthStart);

  if (e1) throw { status: 500, message: e1.message };

  const { count: lastMonthCount, error: e2 } = await supabase
    .from('delivery_table')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('updated_at', lastMonthStart)
    .lt('updated_at', thisMonthStart);

  if (e2) throw { status: 500, message: e2.message };

  const { count: totalCount, error: e3 } = await supabase
    .from('delivery_table')
    .select('*', { count: 'exact', head: true });

  if (e3) throw { status: 500, message: e3.message };

  const { count: completedCount, error: e4 } = await supabase
    .from('delivery_table')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  if (e4) throw { status: 500, message: e4.message };

  const throughput = thisMonthCount ?? 0;
  const lastMonth  = lastMonthCount ?? 0;
  const growth     = lastMonth > 0
    ? Number((((throughput - lastMonth) / lastMonth) * 100).toFixed(1))
    : 0;

  const total      = totalCount ?? 0;
  const completed  = completedCount ?? 0;
  const rate       = total > 0
    ? Number(((completed / total) * 100).toFixed(1))
    : 0;

  return {
    status: 200,
    message: 'Success',
    data: {
      monthlyThroughput: throughput,
      monthlyGrowth: growth,
      completionRate: rate,
      lastSync: new Date().toISOString(), // waktu fetch = last sync
    },
  };
};

