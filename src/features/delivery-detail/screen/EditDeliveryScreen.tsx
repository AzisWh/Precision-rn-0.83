import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useUpdateDeliveryMutation } from '../hooks/editDeliveryHooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../constant/color';
import InputForm from '../../../components/InputForm';
import LocationPickerModal from '../../staff/components/LocationPickerModal';
import { ROUTES, RootStackParamList } from '../../../routes';
import { DeliveryNote, DeliveryStatus, DeliveryType, LatLng } from '../type';
import { useDriverList } from '../../../shared/hooks/driverListMutation';
import { DriverOption } from '../../staff/type';
import { UpdateDeliveryPayload } from '../../staff/type';
import { ApiError } from '../../../type/api';

const DELIVERY_TYPES: DeliveryType[] = [
  'document',
  'vehicle',
  'package',
  'standard',
];

const DELIVERY_STATUSES: DeliveryStatus[] = [
  'pending',
  'arrived',
  'in_transit',
  'completed',
  'rejected'
];

type LocationField = 'origin' | 'destination';

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.EDIT_DELIVERY
>;

const toCoord = (lat: number | null, lng: number | null): LatLng | null =>
  lat != null && lng != null ? { latitude: lat, longitude: lng } : null;

const EditDeliveryScreen = ({ route, navigation }: Props) => {
  const { item } = route.params;
  const { mutateAsync: updateDelivery, isPending: isSaving } =
    useUpdateDeliveryMutation();
  const { drivers } = useDriverList();

  const [dnCode, setDnCode] = useState(item.dn_code ?? '');
  const [routeFrom, setRouteFrom] = useState(item.route_from ?? '');
  const [routeTo, setRouteTo] = useState(item.route_to ?? '');
  const [recipient, setRecipient] = useState(item.recipient ?? '');
  const [signedBy, setSignedBy] = useState(item.signed_by ?? '');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(
    item.delivery_type,
  );
  const [status, setStatus] = useState<DeliveryStatus>(item.status);
  const [driverId, setDriverId] = useState(item.driver_id ?? '');
  const [origin, setOrigin] = useState<LatLng | null>(
    toCoord(item.origin_lat, item.origin_lng),
  );
  const [destination, setDestination] = useState<LatLng | null>(
    toCoord(item.dest_lat, item.dest_lng),
  );

  const [driverSheetOpen, setDriverSheetOpen] = useState(false);
  const [locationPicker, setLocationPicker] = useState<LocationField | null>(
    null,
  );

  const selectedDriver = drivers.find(d => d.id === driverId) ?? null;

  const handleConfirmLocation = (coord: LatLng) => {
    if (locationPicker === 'origin') setOrigin(coord);
    else if (locationPicker === 'destination') setDestination(coord);
    setLocationPicker(null);
  };

  const handleSave = async () => {
    const payload: UpdateDeliveryPayload = {
      id: item.id,
      dn_code: dnCode.trim(),
      status,
      route_from: routeFrom.trim(),
      route_to: routeTo.trim(),
      recipient: recipient.trim(),
      signed_by: signedBy.trim() || null,
      delivery_type: deliveryType,
      driver_id: driverId,
      ...(origin
        ? { origin_lat: origin.latitude, origin_lng: origin.longitude }
        : {}),
      ...(destination
        ? { dest_lat: destination.latitude, dest_lng: destination.longitude }
        : {}),
    };

    try {
      await updateDelivery(payload);
      Alert.alert('Berhasil', `Delivery ${payload.dn_code} diperbarui.`, [
        { text: 'OK', onPress: () => navigation.pop(2) },
      ]);
    } catch (e) {
      const err = e as ApiError;
      Alert.alert('Gagal memperbarui', err.message ?? 'Terjadi kesalahan');
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.headerSide}
        >
          <Text style={styles.cancelText}>Batal</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Delivery</Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.headerSide}
        >
          <Text
            style={[
              styles.saveText,
              isSaving && { color: COLORS.textSecondary },
            ]}
          >
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <InputForm
            label="DN Code"
            placeholder="cth: DN-90378-I"
            leftIcon="barcode-outline"
            leftIconFamily="Ionicons"
            type="text"
            value={dnCode}
            onChangeText={setDnCode}
          />

          <FieldWrapper label="Status">
            <ChipRow
              options={DELIVERY_STATUSES}
              value={status}
              onPick={setStatus}
            />
          </FieldWrapper>

          <FieldWrapper label="Tipe Pengiriman">
            <ChipRow
              options={DELIVERY_TYPES}
              value={deliveryType}
              onPick={setDeliveryType}
            />
          </FieldWrapper>

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
            label="Signed By (opsional)"
            placeholder="cth: Andi"
            leftIcon="pencil-outline"
            leftIconFamily="Ionicons"
            type="text"
            value={signedBy}
            onChangeText={setSignedBy}
          />

          <FieldWrapper label="Driver">
            <PickerRow
              iconName="person-circle-outline"
              value={selectedDriver?.full_name}
              secondary={selectedDriver?.phone ?? undefined}
              placeholder="Pilih driver"
              onPress={() => setDriverSheetOpen(true)}
            />
          </FieldWrapper>

          <FieldWrapper label="Origin (Lokasi Jemput)">
            <PickerRow
              iconName="navigate-outline"
              value={
                origin
                  ? `${origin.latitude.toFixed(6)}, ${origin.longitude.toFixed(
                      6,
                    )}`
                  : undefined
              }
              placeholder="Pilih lewat peta"
              onPress={() => setLocationPicker('origin')}
            />
          </FieldWrapper>

          <FieldWrapper label="Destination (Tujuan)">
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
          </FieldWrapper>
        </ScrollView>
      </KeyboardAvoidingView>

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
          locationPicker === 'origin' ? 'Pilih Origin' : 'Pilih Destination'
        }
        initial={locationPicker === 'origin' ? origin : destination}
        onClose={() => setLocationPicker(null)}
        onConfirm={handleConfirmLocation}
      />
    </SafeAreaView>
  );
};

type FieldWrapperProps = {
  label: string;
  children: React.ReactNode;
};

const FieldWrapper = ({ label, children }: FieldWrapperProps) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

type ChipRowProps<T extends string> = {
  options: T[];
  value: T;
  onPick: (v: T) => void;
};

const ChipRow = <T extends string>({
  options,
  value,
  onPick,
}: ChipRowProps<T>) => (
  <View style={styles.chipRow}>
    {options.map(option => {
      const active = option === value;
      return (
        <TouchableOpacity
          key={option}
          style={[styles.chip, active && styles.chipActive]}
          onPress={() => onPick(option)}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, active && styles.chipTextActive]}>
            {option.replace('_', ' ')}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

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
        keyExtractor={d => d.id}
        renderItem={({ item: d }) => {
          const active = d.id === selectedId;
          return (
            <TouchableOpacity
              style={[styles.driverRow, active && styles.driverRowActive]}
              onPress={() => onSelect(d.id)}
              activeOpacity={0.7}
            >
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarText}>
                  {d.full_name.charAt(0)}
                </Text>
              </View>
              <View style={styles.driverBody}>
                <Text style={styles.driverName}>{d.full_name}</Text>
                <Text style={styles.driverPhone}>{d.phone ?? '-'}</Text>
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

export default EditDeliveryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  headerSide: {
    minWidth: 56,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.brand,
    textAlign: 'right',
  },
  scroll: {
    padding: 16,
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
