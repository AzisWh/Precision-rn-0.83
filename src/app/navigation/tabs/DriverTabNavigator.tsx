import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../constant/color';
import HomeHeader from '../../../components/HeaderTitle';
import DriverHomeScreen from '../../../features/driver/screens/DriverHomeScreen';
import SettingScreens from '../../../features/settings/screen/SettingScreens';
import { DriverTabParamList } from '../../../routes';

const Tab = createBottomTabNavigator<DriverTabParamList>();
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getTabConfig = (routeName: string) => {
  switch (routeName) {
    case 'DriverHome':
      return {
        label: 'TUGAS',
        icon: (color: string, size: number) => (
          <MaterialIcons name="local-shipping" size={size} color={color} />
        ),
      };
    case 'Settings':
      return {
        label: 'SETTINGS',
        icon: (color: string, size: number) => (
          <MaterialIcons name="settings" size={size} color={color} />
        ),
      };
    default:
      return {
        label: routeName,
        icon: (color: string, size: number) => (
          <MaterialIcons name="circle" size={size} color={color} />
        ),
      };
  }
};

const CustomTabBar = ({ state, navigation }: any) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const { label, icon } = getTabConfig(route.name);
        const iconColor = isFocused ? COLORS.white : COLORS.brand;
        const iconSize = SCREEN_WIDTH * 0.065;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.tabItem}
          >
            <View
              style={[styles.tabContent, isFocused && styles.tabContentActive]}
            >
              {icon(iconColor, iconSize)}
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const DriverTabNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <HomeHeader />
      <Tab.Navigator
        tabBar={(props: any) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="DriverHome" component={DriverHomeScreen} />
        <Tab.Screen name="Settings" component={SettingScreens} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default DriverTabNavigator;

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: 8,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    borderRadius: 12,
    gap: 4,
  },
  tabContentActive: {
    backgroundColor: COLORS.brand,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  tabLabel: {
    fontSize: SCREEN_WIDTH * 0.025,
    fontWeight: '700',
    color: COLORS.brand,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.white,
  },
});
