import { ROUTES } from '../../routes';
import { UserRole } from '../../features/login/type/auth';

/**
 * Route root yang tidak memerlukan parameter.
 * Dipakai sebagai hasil pemetaan role -> tab navigator.
 */
export type RoleTabRoute =
  | typeof ROUTES.LOGIN
  | typeof ROUTES.ADMIN_TAB
  | typeof ROUTES.STAFF_TAB
  | typeof ROUTES.DRIVER_TAB
  | typeof ROUTES.PIC_TAB
  | typeof ROUTES.SECURITY_TAB;

/**
 * Memetakan role pengguna ke route tab navigator yang sesuai.
 * Dipakai oleh RootNavigator (initialRouteName) dan PinScreen
 * (navigasi setelah PIN terverifikasi).
 */
export const getRoleTabRoute = (role: UserRole | null): RoleTabRoute => {
  switch (role) {
    case 'admin':
      return ROUTES.ADMIN_TAB;
    case 'staff':
      return ROUTES.STAFF_TAB;
    case 'driver':
      return ROUTES.DRIVER_TAB;
    case 'pic':
      return ROUTES.PIC_TAB;
    case 'security':
      return ROUTES.SECURITY_TAB;
    default:
      return ROUTES.LOGIN;
  }
};
