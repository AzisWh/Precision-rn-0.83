import { View, Text, StyleSheet } from 'react-native';
import SummaryCard from './SummaryCard';
import { COLORS } from '../../../constant/color';
import useDeliverySummary from '../hooks/useDeliverySummary';
import { ErrorState, LoadingState } from '../../../components/StateComponents';

const HomeSummary = () => {
  const { summary, isLoading, isError } = useDeliverySummary();
  console.log('summary', summary);
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState message="Gagal memuat ringkasan data" />
        ) : (
          <>
            <SummaryCard
              title="Total Active"
              value={summary?.total_active ?? 0}
              backgroundColor={COLORS.white}
              titleColor={COLORS.textDark}
              valueColor={COLORS.summaryValue}
            />

            <SummaryCard
              title="In Transit"
              value={summary?.in_transit ?? 0}
              backgroundColor={COLORS.summaryBlue}
              titleColor={COLORS.summaryBlueLight}
              valueColor={COLORS.white}
            />

            <SummaryCard
              title="Pending"
              value={summary?.pending ?? 0}
              backgroundColor={COLORS.summaryPendingBg}
              titleColor={COLORS.summaryPendingText}
              valueColor={COLORS.summaryPendingText}
            />

            <SummaryCard
              title="Arrived"
              value={summary?.arrived ?? 0}
              suffix="h"
              backgroundColor={COLORS.white}
              titleColor={COLORS.textDark}
              valueColor={COLORS.summaryValue}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default HomeSummary;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',

    paddingHorizontal: 16,
    rowGap: 16,
  },
});
