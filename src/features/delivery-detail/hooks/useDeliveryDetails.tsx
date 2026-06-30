import { useState } from 'react';
import { Alert } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROUTES, RootStackParamList } from '../../../routes';
import { DeliveryNote } from '../type';
import { useAuth } from '../../../context/AuthContext';
import { useRole } from '../../../shared/hooks/useRole';
import useDeliveryDetail from './detailHooks';
import {
  useUpdateDeliveryStatusMutation,
  useUpdateStatusBySecurity,
  useRejectRequestMutation,
  useCompleteRequestMutation,
} from './updateStatusHooks';
import { useDeleteDeliveryMutation } from './editDeliveryHooks';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

type Options = {
  item: DeliveryNote;
  navigation: Navigation;
};

const useDeliveryDetails = ({ item, navigation }: Options) => {
  const { auth } = useAuth();
  const { isStaff, isDriver, isSecurity, isPic } = useRole();
  const { deliveryDetail, isLoading } = useDeliveryDetail(item.id);
  const data = deliveryDetail ?? item;

  const canMutate = isStaff && data.status !== 'completed';
  const driverMutate =
    isDriver && data.driver_id !== null && data.status === 'pending';
  const securityMutate = isSecurity && data.status === 'in_transit';
  const rejectMutate = isSecurity && data.status === 'arrived';
  const completeMutate = isPic && data.status === 'arrived';

  const driverId = auth.profile?.id ?? '';
  const rejectBy = auth.profile?.full_name ?? '';
  const { mutate: updateStatus, isPending } =
    useUpdateDeliveryStatusMutation(driverId);
  const { mutate: updateSecurityStatus, isPending: isSecurityPending } =
    useUpdateStatusBySecurity(driverId);
  const { mutate: rejectDelivery, isPending: isRejectPending } =
    useRejectRequestMutation(driverId);
  const { mutate: completeDelivery, isPending: isCompletePending } =
    useCompleteRequestMutation(driverId);
  const { mutate: deleteMutate } = useDeleteDeliveryMutation();

  const [isRejectSheetVisible, setIsRejectSheetVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleComplete = () =>
    Alert.alert(
      'Konfirmasi',
      `Yakin mau Menyelesaikan pengiriman DN ${data.dn_code}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Konfirmasi',
          style: 'destructive',
          onPress: () =>
            completeDelivery(
              { id: data.id, status: 'completed' },
              {
                onSuccess: () => navigation.goBack(),
                onError: err =>
                  Alert.alert(
                    'Gagal update status',
                    err.message ?? 'Terjadi kesalahan',
                  ),
              },
            ),
        },
      ],
      { cancelable: true },
    );

  const handleUpdate = () =>
    Alert.alert(
      'Konfirmasi',
      `Yakin mau konfirmasi pengiriman DN ${data.dn_code}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Konfirmasi',
          style: 'destructive',
          onPress: () =>
            updateStatus(
              { id: data.id, status: 'in_transit' },
              {
                onSuccess: () => navigation.goBack(),
                onError: err =>
                  Alert.alert(
                    'Gagal update status',
                    err.message ?? 'Terjadi kesalahan',
                  ),
              },
            ),
        },
      ],
      { cancelable: true },
    );

  const handleUpdateBySecurity = () =>
    Alert.alert(
      'Konfirmasi',
      `Yakin mau konfirmasi pengiriman DN ${data.dn_code}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Konfirmasi',
          style: 'destructive',
          onPress: () =>
            updateSecurityStatus(
              { id: data.id, status: 'arrived' },
              {
                onSuccess: () => navigation.goBack(),
                onError: err =>
                  Alert.alert(
                    'Gagal update status',
                    err.message ?? 'Terjadi kesalahan',
                  ),
              },
            ),
        },
      ],
      { cancelable: true },
    );

  const handleOpenReject = () => {
    setRejectReason('');
    setIsRejectSheetVisible(true);
  };

  const handleCloseReject = () => {
    setIsRejectSheetVisible(false);
    setRejectReason('');
  };

  const handleReject = () => {
    const reason = rejectReason.trim();
    if (!reason) {
      Alert.alert('Validasi', 'Alasan reject wajib diisi.');
      return;
    }

    rejectDelivery(
      {
        id: data.id,
        reject_reason: reason,
        reject_by: rejectBy,
        status: 'rejected',
      },
      {
        onSuccess: () => {
          setIsRejectSheetVisible(false);
          setRejectReason('');
          Alert.alert(
            'Berhasil',
            `Pengiriman DN ${data.dn_code} berhasil direject.`,
          );
        },
        onError: err =>
          Alert.alert('Gagal reject', err.message ?? 'Terjadi kesalahan'),
      },
    );
  };

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
          onPress: () =>
            deleteMutate(data.id, {
              onSuccess: () => navigation.goBack(),
              onError: err =>
                Alert.alert(
                  'Gagal menghapus',
                  err.message ?? 'Terjadi kesalahan',
                ),
            }),
        },
      ],
      { cancelable: true },
    );

  return {
    data,
    isLoading,
    canMutate,
    driverMutate,
    securityMutate,
    rejectMutate,
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
    completeMutate,
    handleComplete,
    isCompletePending,
  };
};

export default useDeliveryDetails;
