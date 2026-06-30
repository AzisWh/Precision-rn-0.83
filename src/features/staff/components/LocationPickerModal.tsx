import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, LatLng } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../constant/color';

type LocationPickerModalProps = {
  visible: boolean;
  title: string;
  initial?: LatLng | null;
  onClose: () => void;
  onConfirm: (coord: LatLng) => void;
};

const DEFAULT_COORD: LatLng = {
  latitude: -6.208763,
  longitude: 106.845599,
};

const formatCoord = (c: LatLng) =>
  `${c.latitude.toFixed(6)}, ${c.longitude.toFixed(6)}`;

const LocationPickerModal = ({
  visible,
  title,
  initial,
  onClose,
  onConfirm,
}: LocationPickerModalProps) => {
  const insets = useSafeAreaInsets();
  const [coord, setCoord] = useState<LatLng>(initial ?? DEFAULT_COORD);

  useEffect(() => {
    if (visible) {
      setCoord(initial ?? DEFAULT_COORD);
    }
  }, [visible, initial]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.headerBtn}
          >
            <Text style={styles.cancelText}>Batal</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>

          <TouchableOpacity
            onPress={() => onConfirm(coord)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.headerBtn}
          >
            <Text style={styles.confirmText}>Pilih</Text>
          </TouchableOpacity>
        </View>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coord.latitude,
            longitude: coord.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            draggable
            coordinate={coord}
            onDragEnd={e => setCoord(e.nativeEvent.coordinate)}
            pinColor={COLORS.secondary}
          />
        </MapView>

        <View style={styles.footer}>
          <View style={styles.coordRow}>
            <Ionicons name="location" size={18} color={COLORS.brand} />
            <Text style={styles.coordText}>{formatCoord(coord)}</Text>
          </View>
          <Text style={styles.hint}>
            Geser pin untuk menentukan titik lokasi.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default LocationPickerModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  headerBtn: {
    minWidth: 56,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.brand,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.brand,
    textAlign: 'right',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coordText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
