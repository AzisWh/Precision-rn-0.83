import { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, Region, LatLng } from 'react-native-maps';
import { DeliveryMapConfig, DeliveryNote } from '../type';
import { COLORS } from '../../../constant/color';
import { useMapProvider } from '../../../shared/hooks/useMapProvider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const buildMapConfig = (item: DeliveryNote): DeliveryMapConfig => {
  if (item.origin_lat && item.origin_lng && item.dest_lat && item.dest_lng) {
    const origin: LatLng = {
      latitude: item.origin_lat,
      longitude: item.origin_lng,
    };
    const destination: LatLng = {
      latitude: item.dest_lat,
      longitude: item.dest_lng,
    };
    const mid = Array.from({ length: 6 }, (_, i) => {
      const t = (i + 1) / 7;
      return {
        latitude:
          origin.latitude + (destination.latitude - origin.latitude) * t,
        longitude:
          origin.longitude + (destination.longitude - origin.longitude) * t,
      };
    });
    return { origin, destination, waypoints: [origin, ...mid, destination] };
  }

  // fallback dummy kalau lat/lng null
  const seed = item.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const jitter = (n: number) => ((seed * n) % 1000) / 100000;
  const origin: LatLng = {
    latitude: -6.208763 + jitter(7),
    longitude: 106.845599 + jitter(13),
  };
  const destination: LatLng = {
    latitude: -6.175392 + jitter(29),
    longitude: 106.827153 + jitter(41),
  };
  const mid = Array.from({ length: 6 }, (_, i) => {
    const t = (i + 1) / 7;
    return {
      latitude: origin.latitude + (destination.latitude - origin.latitude) * t,
      longitude:
        origin.longitude + (destination.longitude - origin.longitude) * t,
    };
  });
  return { origin, destination, waypoints: [origin, ...mid, destination] };
};

type Props = { item: DeliveryNote };

const DeliveryMap = ({ item }: Props) => {
  const { provider, isReady } = useMapProvider();
  const { origin, destination, waypoints } = buildMapConfig(item);
  const isCompleted = item.status === 'completed';
  const mapRef = useRef<MapView>(null);

  const driverLocation: LatLng = isCompleted
    ? destination
    : item.driver?.detail?.driver_lat && item.driver?.detail?.driver_lng
    ? { latitude: item.driver.detail?.driver_lat, longitude: item.driver.detail?.driver_lng } // pakai posisi DB
    : origin;

  const trail: LatLng[] = isCompleted ? waypoints : [origin, driverLocation];

  useEffect(() => {
    if (!isReady) return;
    mapRef.current?.animateToRegion(
      {
        ...driverLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      } as Region,
      600,
    );
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={[styles.map, styles.loading]}>
        <ActivityIndicator color={COLORS.brand} />
        <Text style={styles.loadingText}>Memuat peta...</Text>
      </View>
    );
  }

  return (
    <MapView
      provider={provider}
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }}
    >
      <Polyline
        coordinates={[origin, destination]}
        strokeColor="#94A3B8"
        strokeWidth={4}
        lineDashPattern={[8, 4]}
      />

      <Polyline
        coordinates={trail}
        strokeColor={COLORS.secondary}
        strokeWidth={4}
      />

      <Marker coordinate={origin} title="Titik Awal" pinColor="green" />
      <Marker coordinate={driverLocation} title="Driver" pinColor="blue" />
      <Marker coordinate={destination} title="Tujuan" pinColor="red" />
    </MapView>
  );
};

export default DeliveryMap;

const styles = StyleSheet.create({
  map: {
    height: SCREEN_HEIGHT * 0.25,
    width: '100%',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
