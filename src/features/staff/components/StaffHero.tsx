import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { COLORS } from '../../../constant/color';
import HistoryCard from '../../history/components/HistoryCard';

// TODO: ganti dengan data real dari API (field lastSync per delivery)
const LAST_SYNC_DUMMY = '02:45 PM Today';

const StaffHero = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Notes</Text>
      <Text style={styles.description}>
        Today's digital delivery note activity
      </Text>

      <View style={styles.cardContainer}>
        <HistoryCard
          label="Last Sync"
          value={LAST_SYNC_DUMMY}
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

export default StaffHero;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.brand,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  cardContainer: {
    marginTop: 20,
    marginBottom: 8,
  },
});
