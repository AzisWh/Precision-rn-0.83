import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Button from '../../../components/Button';
import { COLORS } from '../../../constant/color';
import useLogout from '../hooks/logoutHooks';
import { useMyProfile } from '../../../shared/hooks/profileHooks';
import { LoadingState } from '../../../components/StateComponents';

const SettingScreens = () => {
  const { handleLogout, isPending } = useLogout();
  const { data, isLoading, isError, error } = useMyProfile();

  if (isLoading) return <LoadingState message="Loading profile..." />;
  if (isError) return <Text>{error.message}</Text>;

  const profile = data?.data;

  console.log('Profile data:', profile);

  return (
    <View style={styles.container}>
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

export default SettingScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
