import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ROUTES, RootStackParamList } from '../../../routes';
import { COLORS } from '../../../constant/color';
import DeliveryMap from '../components/DeliveryMap';
import DeliveryInfoCard from '../components/DeliveryInfoCard';
import useDeliveryDetail from '../hooks/detailHooks';
import { LoadingState } from '../../../components/StateComponents';

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.DN_DETAIL
>;

const DeliveryDetailsScreen = ({ route, navigation }: Props) => {
  const { item } = route.params;
  const insets = useSafeAreaInsets();

  const { deliveryDetail, isLoading } = useDeliveryDetail(item.id);

  const data = deliveryDetail ?? item;

  if (isLoading) return <LoadingState />;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <DeliveryMap item={data} />

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
        style={[styles.backBtn, { top: insets.top + 8 }]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="chevron-back" size={26} color={COLORS.white} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DeliveryInfoCard item={data} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeliveryDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backBtn: {
    position: 'absolute',
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});
