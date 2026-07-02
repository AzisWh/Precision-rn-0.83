import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { LatLng } from 'react-native-maps';
import { COLORS } from '../../../constant/color';
import InputForm from '../../../components/InputForm';
import Button from '../../../components/Button';
import LocationPickerModal from './LocationPickerModal';
import { DriverOption, NewDeliveryInput } from '../type';
import { DeliveryType } from '../../delivery-detail/type';
import { useDriverList } from '../../../shared/hooks/driverListMutation';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StaffTabParamList } from '../../../routes';
import { useCreateDeliveryMutation } from '../hooks/insertDeliveryHooks';
import { ApiError } from '../../../type/api';
import { useAuth } from '../../../context/AuthContext';

const DUMMY_DRIVERS: DriverOption[] = [
  {
    id: '1e63c247-a8b2-4c5e-b655-31a307f918ee',
    full_name: 'Budi Santoso',
    phone: '081234567890',
  },
  {
    id: '2b7e9f01-c4d5-4a2e-9f10-7c3a4d5e6f01',
    full_name: 'Andi Wijaya',
    phone: '082345678901',
  },
  {
    id: '3c8faf02-d5e6-4b3f-a011-8d4b5e6f7012',
    full_name: 'Rudi Hartono',
    phone: '083456789012',
  },
  {
    id: '4d9abf03-e6f7-4c4a-b122-9e5c6f708123',
    full_name: 'Slamet Riyadi',
    phone: '084567890123',
  },
];

const DELIVERY_TYPES: DeliveryType[] = [
  'document',
  'vehicle',
  'package',
  'standard',
];

type LocationField = 'origin' | 'destination';

type DeliveryFormProps = {
  onSubmit: (data: NewDeliveryInput) => void;
};

const DeliveryForm = () => {
  const { drivers, isLoading: loadingDrivers } = useDriverList();
  const { mutateAsync: createDelivery, isPending: isSubmitting } =
    useCreateDeliveryMutation();
  const { auth } = useAuth();
  const navigation =
    useNavigation<BottomTabNavigationProp<StaffTabParamList>>();

  console.log('Driver List:', drivers);

  const [dnCode, setDnCode] = useState('');
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [recipient, setRecipient] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('package');
  const [driverId, setDriverId] = useState<string>('');
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);

  const [driverSheetOpen, setDriverSheetOpen] = useState(false);
  const [locationPicker, setLocationPicker] = useState<LocationField | null>(
    null,
  );

  const selectedDriver = drivers.find(driver => driver.id === driverId) || null;

  // const handleSubmit = () => {
  //   if (
  //     !dnCode.trim() ||
  //     !routeFrom.trim() ||
  //     !routeTo.trim() ||
  //     !recipient.trim() ||
  //     !driverId ||
  //     !origin ||
  //     !destination
  //   ) {
  //     Alert.alert(
  //       'Data belum lengkap',
  //       'Isi DN code, rute, penerima, pilih driver, dan tentukan lokasi origin & destination.',
  //     );
  //     return;
  //   }

  //   const payload: NewDeliveryInput = {
  //     dn_code: dnCode.trim(),
  //     status: 'pending',
  //     route_from: routeFrom.trim(),
  //     route_to: routeTo.trim(),
  //     recipient: recipient.trim(),
  //     signed_by: signedBy.trim() || null,
  //     delivery_type: deliveryType,
  //     driver_id: driverId,
  //     origin_lat: origin.latitude,
  //     origin_lng: origin.longitude,
  //     dest_lat: destination.latitude,
  //     dest_lng: destination.longitude,
  //   };

  //   onSubmit(payload);
  // };

  const resetForm = () => {
    setDnCode('');
    setRouteFrom('');
    setRouteTo('');
    setRecipient('');
    setDeliveryType('package');
    setDriverId('');
    setOrigin(null);
    setDestination(null);
    setDriverSheetOpen(false);
    setLocationPicker(null);
  };

  const handleSubmit = async () => {
    if (
      !dnCode.trim() ||
      !routeFrom.trim() ||
      !routeTo.trim() ||
      !recipient.trim() ||
      !driverId ||
      !origin ||
      !destination
    ) {
      Alert.alert(
        'Data belum lengkap',
        'Isi DN code, rute, penerima, pilih driver, dan tentukan lokasi origin & destination.',
      );
      return;
    }

    const payload: NewDeliveryInput = {
      dn_code: dnCode.trim(),
      status: 'pending',
      route_from: routeFrom.trim(),
      route_to: routeTo.trim(),
      recipient: recipient.trim(),
      signed_by: auth.profile?.full_name ?? null,
      delivery_type: deliveryType,
      driver_id: driverId,
      origin_lat: origin.latitude,
      origin_lng: origin.longitude,
      dest_lat: destination.latitude,
      dest_lng: destination.longitude,
    };

    console.log('[DeliveryForm] payload:', payload);

    try {
      await createDelivery(payload);
      resetForm();
      Alert.alert('Berhasil', `Delivery ${payload.dn_code} berhasil dibuat.`, [
        { text: 'OK', onPress: () => navigation.navigate('StaffHome') },
      ]);
    } catch (e) {
      const err = e as ApiError;
      Alert.alert(
        'Gagal menambah delivery',
        err.message ?? 'Terjadi kesalahan',
      );
    }
  };

  const handleConfirmLocation = (coord: LatLng) => {
    if (locationPicker === 'origin') {
      setOrigin(coord);
    } else if (locationPicker === 'destination') {
      setDestination(coord);
    }
    setLocationPicker(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Tambah Delivery Note</Text>
      <Text style={styles.screenSubtitle}>Lengkapi data pengiriman baru</Text>

      {/* Status default — read only */}
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Status Awal</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>PENDING</Text>
        </View>
      </View>

      <InputForm
        label="DN Code"
        placeholder="cth: DN-90378-I"
        leftIcon="barcode-outline"
        leftIconFamily="Ionicons"
        type="text"
        value={dnCode}
        onChangeText={setDnCode}
      />

      <View style={styles.fieldWrapper}>
        <Text style={styles.label}>Tipe Pengiriman</Text>
        <View style={styles.chipRow}>
          {DELIVERY_TYPES.map(type => {
            const active = type === deliveryType;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setDeliveryType(type)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <InputForm
        label="Route From"
        placeholder="cth: Export Terminal"
        leftIcon="location-outline"
        leftIconFamily="Ionicons"
        type="text"
        value={routeFrom}
        onChangeText={setRouteFrom}
      />

      <InputForm
        label="Route To"
        placeholder="cth: Free Trade Zone"
        leftIcon="flag-outline"
        leftIconFamily="Ionicons"
        type="text"
        value={routeTo}
        onChangeText={setRouteTo}
      />

      <InputForm
        label="Recipient"
        placeholder="cth: Free Trade Zone"
        leftIcon="person-outline"
        leftIconFamily="Ionicons"
        type="text"
        value={recipient}
        onChangeText={setRecipient}
      />

      <InputForm
        label="Signed By (otomatis)"
        placeholder="cth: Andi"
        leftIcon="pencil-outline"
        leftIconFamily="Ionicons"
        type="text"
        onChangeText={() => {}}
        value={auth.profile?.full_name ?? ''}
        editable={false}
      />

      <View style={styles.fieldWrapper}>
        <Text style={styles.label}>Driver</Text>
        <PickerRow
          iconName="person-circle-outline"
          value={selectedDriver?.full_name}
          secondary={selectedDriver?.phone ?? undefined}
          placeholder="Pilih driver"
          onPress={() => setDriverSheetOpen(true)}
        />
      </View>

      <View style={styles.fieldWrapper}>
        <Text style={styles.label}>Origin (Lokasi Jemput)</Text>
        <PickerRow
          iconName="navigate-outline"
          value={
            origin
              ? `${origin.latitude.toFixed(6)}, ${origin.longitude.toFixed(6)}`
              : undefined
          }
          placeholder="Pilih lewat peta"
          onPress={() => setLocationPicker('origin')}
        />
      </View>

      <View style={styles.fieldWrapper}>
        <Text style={styles.label}>Destination (Tujuan)</Text>
        <PickerRow
          iconName="location-sharp"
          value={
            destination
              ? `${destination.latitude.toFixed(
                  6,
                )}, ${destination.longitude.toFixed(6)}`
              : undefined
          }
          placeholder="Pilih lewat peta"
          onPress={() => setLocationPicker('destination')}
        />
      </View>

      <View style={styles.submitWrap}>
        <Button
          title={isSubmitting ? 'Menyimpan...' : 'Tambah Delivery'}
          onPress={handleSubmit}
          rightIcon="checkcircleo"
        />
      </View>

      <DriverPickerSheet
        visible={driverSheetOpen}
        drivers={drivers}
        selectedId={driverId}
        onSelect={id => {
          setDriverId(id);
          setDriverSheetOpen(false);
        }}
        onClose={() => setDriverSheetOpen(false)}
      />

      <LocationPickerModal
        visible={locationPicker !== null}
        title={
          locationPicker === 'origin' ? 'Pilih Lokasi' : 'Pilih Destination'
        }
        initial={locationPicker === 'origin' ? origin : destination}
        onClose={() => setLocationPicker(null)}
        onConfirm={handleConfirmLocation}
      />
    </View>
  );
};

type PickerRowProps = {
  iconName: string;
  value?: string;
  secondary?: string;
  placeholder: string;
  onPress: () => void;
};

const PickerRow = ({
  iconName,
  value,
  secondary,
  placeholder,
  onPress,
}: PickerRowProps) => {
  const hasValue = !!value;
  return (
    <TouchableOpacity
      style={styles.pickerRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.pickerIcon}>
        <Ionicons name={iconName} size={20} color={COLORS.brand} />
      </View>

      <View style={styles.pickerBody}>
        <Text
          style={[styles.pickerValue, !hasValue && styles.pickerPlaceholder]}
          numberOfLines={1}
        >
          {hasValue ? value : placeholder}
        </Text>
        {hasValue && secondary ? (
          <Text style={styles.pickerSecondary} numberOfLines={1}>
            {secondary}
          </Text>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
};

type DriverPickerSheetProps = {
  visible: boolean;
  drivers: DriverOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
};

const DriverPickerSheet = ({
  visible,
  drivers,
  selectedId,
  onSelect,
  onClose,
}: DriverPickerSheetProps) => (
  <Modal
    visible={visible}
    animationType="slide"
    presentationStyle="pageSheet"
    onRequestClose={onClose}
  >
    <View style={styles.sheet}>
      <View style={styles.sheetHeader}>
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.sheetHeaderBtn}
        >
          <Text style={styles.sheetCancel}>Tutup</Text>
        </TouchableOpacity>
        <Text style={styles.sheetTitle}>Pilih Driver</Text>
        <View style={styles.sheetHeaderBtn} />
      </View>

      <FlatList
        data={drivers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const active = item.id === selectedId;
          return (
            <TouchableOpacity
              style={[styles.driverRow, active && styles.driverRowActive]}
              onPress={() => onSelect(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarText}>
                  {item.full_name.charAt(0)}
                </Text>
              </View>
              <View style={styles.driverBody}>
                <Text style={styles.driverName}>{item.full_name}</Text>
                <Text style={styles.driverPhone}>{item.phone ?? '-'}</Text>
              </View>
              {active ? (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={COLORS.brand}
                />
              ) : (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORS.textSecondary}
                />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  </Modal>
);

export default DeliveryForm;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  screenSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.summaryPendingBg,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.summaryPendingText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    backgroundColor: COLORS.summaryPendingText,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: COLORS.white,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 56,
  },
  pickerIcon: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  pickerBody: {
    flex: 1,
  },
  pickerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  pickerPlaceholder: {
    fontWeight: '500',
    color: COLORS.placeholder,
  },
  pickerSecondary: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  submitWrap: {
    marginTop: 8,
  },
  // Driver sheet
  sheet: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sheetHeaderBtn: {
    minWidth: 56,
  },
  sheetTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  sheetCancel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.brand,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  driverRowActive: {
    backgroundColor: COLORS.background,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  driverBody: {
    flex: 1,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  driverPhone: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
