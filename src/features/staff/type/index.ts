import { DeliveryType } from "../../delivery-detail/type";

export type DriverOption = {
  id: string;
  full_name: string;
  phone: string | null;
};

export type NewDeliveryInput = {
  dn_code: string;
  status: 'pending';
  route_from: string;
  route_to: string;
  recipient: string;
  signed_by: string | null;
  delivery_type: DeliveryType;
  driver_id: string;
  origin_lat: number;
  origin_lng: number;
  dest_lat: number;
  dest_lng: number;
};

export type UpdateDeliveryInput = {
  dn_code?: string;
  status?: 'pending' | 'in_transit' | 'dispatched' | 'completed';
  route_from?: string;
  route_to?: string;
  recipient?: string;
  signed_by?: string | null;
  delivery_type?: DeliveryType;
  driver_id?: string;
  origin_lat?: number;
  origin_lng?: number;
  dest_lat?: number;
  dest_lng?: number;
};

export type UpdateDeliveryPayload = { id: string } & UpdateDeliveryInput;