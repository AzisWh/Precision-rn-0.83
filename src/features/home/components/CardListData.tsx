import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../constant/color';

type Props = {
  dnCode: string;
  routeFrom: string | null;
  routeTo: string | null;
  updatedAt: string;
  status: string;
  onPress?: () => void;
};

const CardListData = ({
  dnCode,
  routeFrom,
  routeTo,
  updatedAt,
  status,
  onPress,
}: Props) => {
  const isPending = status?.toLowerCase() === 'pending';

  const badgeBg = isPending ? COLORS.summaryPendingBg : COLORS.summaryBlue;

  const badgeText = isPending ? COLORS.summaryPendingText : COLORS.white;

  const iconName = isPending ? 'clipboard-clock-outline' : 'truck';

  const iconColor = isPending ? COLORS.summaryPendingText : COLORS.brand;

  const formattedTime = new Date(updatedAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.leftSection}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name={iconName} size={34} color={iconColor} />
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.updatedLabel}>UPDATED</Text>
          <Text style={styles.updatedValue}>{formattedTime}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.topRow}>
          <Text style={styles.dnCode}>{dnCode}</Text>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: badgeBg,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: badgeText,
                },
              ]}
            >
              {status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.route}>
          Route: {routeFrom} to {routeTo}
        </Text>

        <Ionicons
          name="chevron-forward"
          size={24}
          color={COLORS.placeholder}
          style={styles.chevron}
        />
      </View>
    </Pressable>
  );
};

export default CardListData;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 16,
  },

  leftSection: {
    width: 90,
    marginRight: 16,
  },

  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 18,
    backgroundColor: COLORS.footerBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },

  timeContainer: {
    marginTop: 16,
  },

  updatedLabel: {
    fontSize: 12,
    letterSpacing: 2,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },

  updatedValue: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  rightSection: {
    flex: 1,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },

  dnCode: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.summaryValue,
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  badgeText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },

  route: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textPrimary,
    paddingRight: 24,
  },

  chevron: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
