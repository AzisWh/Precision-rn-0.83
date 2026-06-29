import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, RootStackParamList } from '../../routes';
import { useAuth } from '../../context/AuthContext';
import { getRoleTabRoute } from '../../shared/utils/getRoleTabRoute';
import LoginScreen from '../../features/login/screens/LoginScreen';
import PinScreen from '../../features/pin/screens/PinScreen';
import AdminTabNavigator from './tabs/AdminTabNavigator';
import StaffTabNavigator from './tabs/StaffTabNavigator';
import DriverTabNavigator from './tabs/DriverTabNavigator';
import PicTabNavigator from './tabs/PicTabNavigator';
import SecurityTabNavigator from './tabs/SecurityTabNavigator';
import DeliveryDetailsScreen from '../../features/delivery-detail/screen/DeliveryDetailsScreen';
import EditDeliveryScreen from '../../features/delivery-detail/screen/EditDeliveryScreen';
import EditProfileScreen from '../../features/settings/screen/EditProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { auth } = useAuth();
  const { token, isPinVerified, role } = auth;

  const getInitialRoute = (): keyof RootStackParamList => {
    if (!token) return ROUTES.LOGIN;
    if (!isPinVerified) return ROUTES.PIN;
    return getRoleTabRoute(role);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
        <Stack.Screen name={ROUTES.PIN} component={PinScreen} />
        <Stack.Screen name={ROUTES.ADMIN_TAB} component={AdminTabNavigator} />
        <Stack.Screen name={ROUTES.STAFF_TAB} component={StaffTabNavigator} />
        <Stack.Screen name={ROUTES.DRIVER_TAB} component={DriverTabNavigator} />
        <Stack.Screen name={ROUTES.PIC_TAB} component={PicTabNavigator} />
        <Stack.Screen name={ROUTES.SECURITY_TAB} component={SecurityTabNavigator} />
        <Stack.Screen name={ROUTES.DN_DETAIL} component={DeliveryDetailsScreen} />
        <Stack.Screen
          name={ROUTES.EDIT_DELIVERY}
          component={EditDeliveryScreen}
        />
        <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
