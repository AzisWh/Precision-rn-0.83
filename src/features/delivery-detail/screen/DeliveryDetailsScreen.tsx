import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
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
import { useRole } from '../../../shared/hooks/useRole';
import { useDeleteDeliveryMutation } from '../hooks/editDeliveryHooks';

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.DN_DETAIL
>;

const DeliveryDetailsScreen = ({ route, navigation }: Props) => {
  const { item } = route.params;
  const insets = useSafeAreaInsets();

  const { deliveryDetail, isLoading } = useDeliveryDetail(item.id);

  const data = deliveryDetail ?? item;

  const { isStaff } = useRole();
  // Completed delivery tidak bisa di-edit/hapus dari UI (hanya lewat DB).
  const canMutate = isStaff && data.status !== 'completed';
  const { mutate: deleteMutate } = useDeleteDeliveryMutation();

  const handleEdit = () =>
    navigation.navigate(ROUTES.EDIT_DELIVERY, { item: data });

  const handleDelete = () =>
    Alert.alert(
      'Hapus Delivery?',
      `Yakin mau hapus DN ${data.dn_code}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            deleteMutate(data.id, {
              onSuccess: () => navigation.goBack(),
              onError: err =>
                Alert.alert(
                  'Gagal menghapus',
                  err.message ?? 'Terjadi kesalahan',
                ),
            });
          },
        },
      ],
      { cancelable: true },
    );

  console.log('Delivery Detail Data:', data);

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

      {canMutate && (
        <View style={[styles.actionRow, { top: insets.top + 8 }]}>
          <TouchableOpacity
            onPress={handleEdit}
            activeOpacity={0.8}
            style={styles.actionBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="create-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            activeOpacity={0.8}
            style={[styles.actionBtn, styles.actionBtnDanger]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}

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
  actionRow: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
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
  actionBtnDanger: {
    backgroundColor: COLORS.error,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});
