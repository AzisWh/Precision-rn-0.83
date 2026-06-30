export type HomeScreenParams = {
  token: string;
  userName: string;
};

export type DriverDetail = {
  vehicle_type: string | null;
  driver_lat: number | null;
  driver_lng: number | null;
  last_location_update: string | null;
};

export type Driver = {
  id: string;
  full_name: string;
  phone: string | null;
  detail: DriverDetail | null;
};

export type DeliveryType = 'document' | 'vehicle' | 'package' | 'standard';

export type DeliveryNote = {
  id: string;
  dn_code: string;
  status: 'in_transit' | 'pending' | 'completed' | 'arrived' | 'rejected';
  route_from: string | null;
  route_to: string | null;
  recipient: string | null;
  signed_by: string | null;
  delivery_type: DeliveryType;
  updated_at: string;
  created_at: string;
  driver_id: string | null;
  origin_lat: number | null;
  origin_lng: number | null;
  dest_lat: number | null;
  dest_lng: number | null;
  driver: Driver | null;
  reject_reason: string | null;
  reject_by: string | null;
};

export type DeliverySummary = {
  total_active: number;
  in_transit: number;
  pending: number;
  arrived: number;
};