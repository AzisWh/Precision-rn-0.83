import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../constant/color';

export interface HistoryCardProps {
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
  backgroundColor?: string;
  labelColor?: string;
  valueColor?: string;
  badgeTextColor?: string;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  iconBgColor?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  label,
  value,
  badge,
  badgeColor,
  backgroundColor = COLORS.white,
  labelColor = COLORS.textSecondary,
  valueColor = COLORS.summaryBlue,
  badgeTextColor,
  iconName,
  iconSize = 28,
  iconColor = COLORS.white,
  iconBgColor = COLORS.cardDark,
  containerStyle,
  labelStyle,
  valueStyle,
}) => {
  const resolvedBadgeColor = badgeTextColor ?? badgeColor ?? COLORS.secondary;

  return (
    <View style={[styles.card, { backgroundColor }, containerStyle]}>
      <View style={styles.textBlock}>
        <Text
          style={[styles.label, { color: labelColor }, labelStyle]}
          numberOfLines={1}
        >
          {label.toUpperCase()}
        </Text>

        <View style={styles.valueRow}>
          <Text
            style={[styles.value, { color: valueColor }, valueStyle]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {value}
          </Text>

          {badge ? (
            <Text style={[styles.badge, { color: resolvedBadgeColor }]}>
              {badge}
            </Text>
          ) : null}
        </View>
      </View>

      {iconName ? (
        <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
          <Icon name={iconName} size={iconSize} color={iconColor} />
        </View>
      ) : null}
    </View>
  );
};

export default HistoryCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  textBlock: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1.2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    flexWrap: 'wrap',
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 42,
  },
  badge: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    opacity: 0.85,
  },
});
