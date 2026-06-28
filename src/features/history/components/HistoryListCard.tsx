import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../constant/color';
import { DeliveryType } from '../../home/type/home';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  dnCode: string;
  recipient: string | null;
  signedBy: string | null;
  updatedAt: string;
  status: string;
  deliveryType: DeliveryType;
  onPress?: () => void;
};

const getIconConfig = (type: DeliveryType) => {
  switch (type) {
    case 'document':
      return { name: 'clipboard-check-outline', color: COLORS.brand };
    case 'vehicle':
      return { name: 'truck-outline', color: COLORS.brand };
    case 'package':
      return { name: 'package-variant-closed', color: COLORS.brand };
    case 'standard':
    default:
      return { name: 'clipboard-outline', color: COLORS.brand };
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date
    .toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    .toUpperCase(); // "OCT 24, 2023"
};

const HistoryListCard = ({
  dnCode,
  recipient,
  signedBy,
  updatedAt,
  status,
  deliveryType,
  onPress,
}: Props) => {
  const { name: iconName, color: iconColor } = getIconConfig(deliveryType);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={iconName} size={32} color={iconColor} />
      </View>

      <View style={styles.rightSection}>
        <View style={styles.topRow}>
          <Text style={styles.dnCode}>{dnCode}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.recipient} numberOfLines={2}>
          Recipient: {recipient ?? '-'}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.date}>{formatDate(updatedAt)}</Text>
          <Text style={styles.signedBy}>Signed by: {signedBy ?? '-'}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default HistoryListCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  iconBox: {
    width: SCREEN_WIDTH * 0.13,
    height: SCREEN_WIDTH * 0.13,
    borderRadius: 12,
    backgroundColor: COLORS.footerBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightSection: {
    flex: 1,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dnCode: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  badge: {
    backgroundColor: COLORS.brand,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: SCREEN_WIDTH * 0.022,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  recipient: {
    fontSize: SCREEN_WIDTH * 0.035,
    color: COLORS.textSecondary,
    lineHeight: SCREEN_WIDTH * 0.05,
  },

  bottomRow: {
    marginTop: 4,
    alignItems: 'flex-end',
    gap: 2,
  },
  date: {
    fontSize: SCREEN_WIDTH * 0.03,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  signedBy: {
    fontSize: SCREEN_WIDTH * 0.03,
    color: COLORS.textSecondary,
  },
});
