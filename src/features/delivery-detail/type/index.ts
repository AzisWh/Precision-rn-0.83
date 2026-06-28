import { DeliveryNote, DeliveryType, Driver } from "../../home/type/home";

export type { DeliveryNote, DeliveryType, Driver };

export type LatLng = { 
  latitude: number; 
  longitude: number 
};

export type DeliveryMapConfig = { 
  origin: LatLng; 
  destination: LatLng; 
  waypoints: LatLng[] 
};

export type DeliveryStatus = DeliveryNote['status']; 
export type StatusBadgeStyle = { 
  bg: string; 
  text: string; 
  label: string 
};