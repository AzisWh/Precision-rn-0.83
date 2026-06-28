import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../constant/color';

type SummaryCardProps = {
  title: string;
  value: number | string;
  backgroundColor?: string;
  titleColor?: string;
  valueColor?: string;
  suffix?: string;
};

const SummaryCard = ({
  title,
  value,
  backgroundColor = COLORS.white,
  titleColor = COLORS.textDark,
  valueColor = COLORS.summaryValue,
  suffix = '',
}: SummaryCardProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: titleColor,
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.value,
          {
            color: valueColor,
          },
        ]}
      >
        {value}
        {suffix}
      </Text>
    </View>
  );
};

export default SummaryCard;

const styles = StyleSheet.create({
  container: {
    width: '47%',
    height: 160,

    borderRadius: 20,
    padding: 20,

    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  value: {
    fontSize: 54,
    fontWeight: '700',
    letterSpacing: -1,
  },
});
