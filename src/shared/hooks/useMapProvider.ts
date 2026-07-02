import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PROVIDER_GOOGLE } from 'react-native-maps';

const STORAGE_KEY = '@precision/map_provider';

type Choice = 'google' | 'apple';

type State = {
  choice: Choice | null; // null = user belum memilih
  loaded: boolean; // true setelah AsyncStorage selesai dibaca
};

// State global (module-level) + pub-sub sederhana, supaya prompt hanya muncul
// sekali di seluruh app walau hook dipasang di banyak layar sekaligus.
let state: State = { choice: null, loaded: false };
const listeners = new Set<(s: State) => void>();
let booted = false;

const notify = () => listeners.forEach(l => l(state));

const setState = (next: State) => {
  state = next;
  notify();
};

const persist = (choice: Choice) => {
  AsyncStorage.setItem(STORAGE_KEY, choice).catch(() => {});
  setState({ choice, loaded: true });
};

const promptOnce = () => {
  Alert.alert(
    'Pilih tampilan peta',
    'Kamu ingin menggunakan Google Maps atau Apple Maps? Pilihan ini berlaku untuk semua peta di aplikasi.',
    [
      { text: 'Apple Maps', onPress: () => persist('apple') },
      { text: 'Google Maps', onPress: () => persist('google') },
    ],
    { cancelable: false },
  );
};

// Idempotent — aman dipanggil dari banyak komponen.
const boot = () => {
  if (booted) return;
  booted = true;
  (async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'google' || stored === 'apple') {
        setState({ choice: stored, loaded: true });
      } else {
        setState({ choice: null, loaded: true });
        promptOnce();
      }
    } catch {
      setState({ choice: null, loaded: true });
      promptOnce();
    }
  })();
};

export type MapProviderResult = {
  /** Nilai untuk prop `provider` di <MapView />. undefined => Apple Maps (default iOS). */
  provider: 'google' | undefined;
  /** true ketika MapView sudah aman dirender (di iOS = setelah user memilih). */
  isReady: boolean;
};

/**
 * Menentukan provider peta:
 * - Android: selalu Google Maps (Apple Maps tidak tersedia di Android).
 * - iOS: minta user memilih SEKALI (Google / Apple Maps), lalu simpan pilihan
 *   ke AsyncStorage. Pilihan berlaku untuk semua peta di app.
 */
export const useMapProvider = (): MapProviderResult => {
  const [local, setLocal] = useState<State>(state);

  useEffect(() => {
    if (Platform.OS !== 'ios') return; // Android tidak butuh prompt

    const listener = (s: State) => setLocal(s);
    listeners.add(listener);
    boot();

    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (Platform.OS === 'android') {
    return { provider: PROVIDER_GOOGLE, isReady: true };
  }

  return {
    provider: local.choice === 'google' ? PROVIDER_GOOGLE : undefined,
    isReady: local.loaded && local.choice !== null,
  };
};
