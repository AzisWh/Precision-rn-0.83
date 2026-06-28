import { DeliveryNote } from '../features/home/type/home';

export const ROUTES = {
  LOGIN: 'Login',
  PIN: 'Pin',
  // 
  ADMIN_TAB: 'AdminTab',
  STAFF_TAB: 'StaffTab',
  DRIVER_TAB: 'DriverTab',
  PIC_TAB: 'PicTab',
  SECURITY_TAB: 'SecurityTab',
  // 
  DN_DETAIL: 'DNDetail',
} as const;

export type RootStackParamList = {
  [ROUTES.LOGIN]: undefined;
  [ROUTES.PIN]: { token: string };
  [ROUTES.ADMIN_TAB]: undefined;
  [ROUTES.STAFF_TAB]: undefined;
  [ROUTES.DRIVER_TAB]: undefined;
  [ROUTES.PIC_TAB]: undefined;
  [ROUTES.SECURITY_TAB]: undefined;
  [ROUTES.DN_DETAIL]: { item: DeliveryNote };
};

export type AdminTabParamList = {
  Home: undefined;
  History: undefined;
  Settings: undefined;
};

export type StaffTabParamList = {
  StaffHome: undefined;
  StaffInput: undefined;
  Settings: undefined;
};

export type DriverTabParamList = {
  DriverHome: undefined;
  Settings: undefined;
};

export type PicTabParamList = {
  PicHome: undefined;
  PicApproval: undefined;
  Settings: undefined;
};

export type SecurityTabParamList = {
  SecurityHome: undefined;
  SecurityScan: undefined;
  Settings: undefined;
};