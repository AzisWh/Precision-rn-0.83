import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../constant/color';
import Button from '../../../components/Button';
import useLogout from '../../../features/settings/hooks/logoutHooks';

const StaffHomeScreen = () => {
  const { handleLogout, isPending } = useLogout();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Staff Home</Text>
      <Button
        title={isPending ? 'Keluar...' : 'Keluar'}
        onPress={handleLogout}
        disabled={isPending}
        bgColor={COLORS.error ?? '#EF4444'}
        widthRatio={0.88}
        height={52}
        borderRadius={10}
        fontSize={16}
        rightIcon="log-out-outline"
        iconFamily="Ionicons"
      />
    </View>
  );
};

export default StaffHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    gap: 32,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
});
