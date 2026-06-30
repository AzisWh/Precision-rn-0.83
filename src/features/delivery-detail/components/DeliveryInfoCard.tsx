import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../../constant/color';
import {
  DeliveryNote,
  DeliveryStatus,
  DeliveryType,
  Driver,
  StatusBadgeStyle,
} from '../type';

const STATUS_STYLES: Record<DeliveryStatus, StatusBadgeStyle> = {
  completed: {
    bg: COLORS.badgeGreen,
    text: COLORS.badgeGreenText,
    label: 'COMPLETED',
  },
  pending: {
    bg: COLORS.summaryPendingBg,
    text: COLORS.summaryPendingText,
    label: 'PENDING',
  },
  in_transit: {
    bg: COLORS.summaryBlue,
    text: COLORS.white,
    label: 'IN TRANSIT',
  },
  arrived: {
    bg: COLORS.brand,
    text: COLORS.white,
    label: 'ARRIVED',
  },
  rejected: {
    bg: COLORS.error,
    text: COLORS.white,
    label: 'REJECTED',
  },
};

const getStatusStyle = (status: DeliveryStatus): StatusBadgeStyle =>
  STATUS_STYLES[status] ?? {
    bg: COLORS.footerBackground,
    text: COLORS.textSecondary,
    label: status.replace('_', ' ').toUpperCase(),
  };

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const formatDateTime = (iso: string | null | undefined) =>
  iso ? `${formatDate(iso)} · ${formatTime(iso)}` : '-';

const TYPE_ICON: Record<DeliveryType, string> = {
  document: 'clipboard-check-outline',
  vehicle: 'truck-outline',
  package: 'package-variant-closed',
  standard: 'clipboard-outline',
};

type Props = { item: DeliveryNote };

const DeliveryInfoCard = ({ item }: Props) => {
  const badge = getStatusStyle(item.status);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.dnCode} numberOfLines={1}>
          {item.dn_code}
        </Text>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.text }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      <Row label="From" value={item.route_from} />
      <Row label="To" value={item.route_to} />

      <View style={styles.chipRow}>
        <View style={styles.chip}>
          <MaterialCommunityIcons
            name={TYPE_ICON[item.delivery_type]}
            size={18}
            color={COLORS.brand}
          />
          <Text style={styles.chipText}>
            {item.delivery_type.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Row label="Recipient" value={item.recipient} />
      <Row label="Signed by" value={item.signed_by} />

      <View style={styles.divider} />

      <DateRow label="Created" value={formatDateTime(item.created_at)} />
      <DateRow label="Updated" value={formatDateTime(item.updated_at)} />
      <View style={styles.divider} />

      <DriverSection driver={item.driver} />

      <View style={styles.divider} />
    </View>
  );
};

const Row = ({ label, value }: { label: string; value: string | null }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value} numberOfLines={2}>
      {value ?? '-'}
    </Text>
  </View>
);

const DateRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.dateValue}>{value}</Text>
  </View>
);

const DriverSection = ({ driver }: { driver: Driver | null }) => {
  if (!driver) {
    return (
      <View style={styles.driverEmpty}>
        <MaterialCommunityIcons
          name="account-off-outline"
          size={16}
          color={COLORS.textSecondary}
        />
        <Text style={styles.driverEmptyText}>Belum ada driver ditugaskan</Text>
      </View>
    );
  }

  return (
    <View style={styles.driverSection}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons
          name="account-circle-outline"
          size={18}
          color={COLORS.brand}
        />
        <Text style={styles.sectionHeaderText}>DRIVER</Text>
      </View>
      <Row label="Name" value={driver.full_name} />
      <Row label="Phone" value={driver.phone} />
      <DateRow
        label="Last update"
        value={formatDateTime(driver.detail?.last_location_update)}
      />
    </View>
  );
};

export default DeliveryInfoCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dnCode: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  value: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    textAlign: 'right',
  },
  dateValue: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textPrimary,
    textAlign: 'right',
  },
  chipRow: {
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.footerBackground,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand,
    letterSpacing: 0.5,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },
  driverSection: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand,
    letterSpacing: 0.5,
  },
  driverEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  driverEmptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
