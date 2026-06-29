import { View, StyleSheet, ScrollView } from 'react-native';
import Button from '../../../components/Button';
import { COLORS } from '../../../constant/color';
import useLogout from '../hooks/logoutHooks';
import ProfileScreen from '../components/ProfileScreen';

const SettingScreens = () => {
  const { handleLogout, isPending } = useLogout();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileScreen />
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
      </ScrollView>
    </View>
  );
};

export default SettingScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 24,
  },
});
