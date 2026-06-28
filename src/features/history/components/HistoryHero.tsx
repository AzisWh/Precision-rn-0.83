import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import { COLORS } from '../../../constant/color';
import HistoryCard from './HistoryCard';
import useHistoryStats from '../hooks/historyStats';
import { LoadingState } from '../../../components/StateComponents';

// last sync
const formatLastSync = (isoString: string): string => {
  const date = new Date(isoString);
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${time} Today`;
};

const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

const HistoryHero = () => {
  const { stats, isLoading, isError } = useHistoryStats();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>History DN</Text>
        <Text style={styles.description}>
          Audit trail for completed digital delivery notes
        </Text>
        <View style={[styles.cardContainer, styles.centered]}>
          <LoadingState message="Memuat statistik history..." />
        </View>
      </View>
    );
  }

  const throughput = stats ? formatNumber(stats.monthlyThroughput) : '-';
  const growth = stats ? `+${stats.monthlyGrowth}%` : '-';
  const completionRate = stats ? `${stats.completionRate}%` : '-';
  const lastSync = stats ? formatLastSync(stats.lastSync) : '-';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History DN</Text>
      <Text style={styles.description}>
        Audit trail for completed digital delivery notes
      </Text>

      <View style={styles.cardContainer}>
        <HistoryCard
          label="Monthly Throughput"
          value={throughput}
          badge={growth}
          badgeTextColor={COLORS.brand}
        />

        <HistoryCard
          label="Completion Rate"
          value={completionRate}
          backgroundColor={COLORS.background}
        />

        <HistoryCard
          label="Last Sync"
          value={lastSync}
          backgroundColor={COLORS.cardDark}
          labelColor={COLORS.summaryBlueLight}
          valueColor={COLORS.white}
          iconName="sync-outline"
          iconColor={COLORS.summaryBlueLight}
          iconBgColor="rgba(255,255,255,0.1)"
        />
      </View>
    </View>
  );
};

export default HistoryHero;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: COLORS.brand,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  cardContainer: {
    gap: 16,
    paddingVertical: 24,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
});
