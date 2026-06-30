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
import { LoadingState } from '../../../components/StateComponents';
import Button from '../../../components/Button';
import RejectReasonSheet from '../components/RejectReasonSheet';
import useDeliveryDetails from '../hooks/useDeliveryDetails';

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.DN_DETAIL
>;

const DeliveryDetailsScreen = ({ route, navigation }: Props) => {
  const { item } = route.params;
  const insets = useSafeAreaInsets();

  const {
    data,
    isLoading,
    canMutate,
    driverMutate,
    securityMutate,
    rejectMutate,
    completeMutate,
    isPending,
    isSecurityPending,
    isRejectPending,
    isRejectSheetVisible,
    rejectReason,
    rejectBy,
    setRejectReason,
    handleOpenReject,
    handleCloseReject,
    handleReject,
    handleEdit,
    handleDelete,
    handleUpdate,
    handleUpdateBySecurity,
    handleComplete,
    isCompletePending,
  } = useDeliveryDetails({ item, navigation });

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
        {driverMutate && (
          <View style={{ marginTop: 16, marginBottom: insets.bottom + 16 }}>
            <Button
              title={isPending ? 'Memperbarui...' : 'Konfirmasi Pengiriman'}
              onPress={handleUpdate}
              rightIcon="checkcircleo"
            />
          </View>
        )}

        {securityMutate && (
          <View style={{ marginTop: 16, marginBottom: insets.bottom + 16 }}>
            <Button
              title={
                isSecurityPending ? 'Memperbarui...' : 'Konfirmasi Pengiriman'
              }
              onPress={handleUpdateBySecurity}
              rightIcon="checkcircleo"
            />
          </View>
        )}

        {rejectMutate && (
          <View style={{ marginTop: 16, marginBottom: insets.bottom + 16 }}>
            <Button
              title={isRejectPending ? 'Memproses...' : 'Reject Pengiriman'}
              onPress={handleOpenReject}
              rightIcon="closecircleo"
            />
          </View>
        )}

        {completeMutate && (
          <View style={{ marginTop: 16, marginBottom: insets.bottom + 16 }}>
            <Button
              title={
                isCompletePending ? 'Memproses...' : 'Selesaikan Pengiriman'
              }
              onPress={handleComplete}
              rightIcon="checkcircleo"
            />
          </View>
        )}
      </ScrollView>

      <RejectReasonSheet
        visible={isRejectSheetVisible}
        rejectBy={rejectBy}
        reason={rejectReason}
        onChangeReason={setRejectReason}
        onClose={handleCloseReject}
        onSubmit={handleReject}
        isPending={isRejectPending}
      />
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
