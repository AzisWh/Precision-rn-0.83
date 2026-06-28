import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constant/color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type LoadingProps = {
  message?: string;
};

export const LoadingState = ({ message = 'Memuat data...' }: LoadingProps) => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" color={COLORS.brand} />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

type ErrorProps = {
  message?: string;
  hint?: string;
};

export const ErrorState = ({
  message = 'Gagal memuat data',
  hint = 'Tarik ke bawah untuk mencoba lagi',
}: ErrorProps) => (
  <View style={styles.centered}>
    <Text style={styles.errorIcon}>⚠️</Text>
    <Text style={styles.errorText}>{message}</Text>
    <Text style={styles.errorHint}>{hint}</Text>
  </View>
);

type EmptyProps = {
  message?: string;
};

export const EmptyState = ({ message = 'Belum ada data' }: EmptyProps) => (
  <View style={styles.centered}>
    <Text style={styles.errorIcon}>📭</Text>
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SCREEN_WIDTH * 0.1,
    gap: 8,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  errorIcon: {
    fontSize: 36,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  errorHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
