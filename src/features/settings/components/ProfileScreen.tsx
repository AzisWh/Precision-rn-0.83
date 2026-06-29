import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../constant/color';
import { ROUTES, RootStackParamList } from '../../../routes';
import { UserRole } from '../../login/type/auth';
import { useMyProfile } from '../../../shared/hooks/profileHooks';
import { ErrorState, LoadingState } from '../../../components/StateComponents';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Admin',
  staff: 'Staff',
  driver: 'Driver',
  pic: 'PIC',
  security: 'Security',
};

type RowProps = {
  icon: string;
  label: string;
  value: string;
};

const InfoRow = ({ icon, label, value }: RowProps) => (
  <View style={styles.row}>
    <View style={styles.rowIcon}>
      <MaterialIcons name={icon} size={18} color={COLORS.brand} />
    </View>
    <View style={styles.rowBody}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} selectable>
        {value}
      </Text>
    </View>
  </View>
);

const ProfileScreen = () => {
  const { data, isLoading, isError } = useMyProfile();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (isLoading) {
    return <LoadingState message="Memuat profil..." />;
  }

  if (isError || !data) {
    return <ErrorState message="Profil gagal dimuat" />;
  }

  const profile = data.data;
  const initials =
    profile.full_name
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="edit" size={20} color={COLORS.brand} />
        </TouchableOpacity>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{profile.full_name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {ROLE_LABEL[profile.role] ?? profile.role}
            </Text>
          </View>
        </View>

        <View style={styles.detailList}>
          <InfoRow icon="phone" label="Nomor HP" value={profile.phone} />
          <View style={styles.divider} />
          {/* <InfoRow icon="badge" label="User ID" value={profile.id} /> */}
          {/* <View style={styles.divider} /> */}
          <InfoRow
            icon="verified-user"
            label="Status Akun"
            value={profile.is_active ? 'Aktif' : 'Nonaktif'}
          />
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  wrapper: {
    width: SCREEN_WIDTH * 0.88,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.white,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  roleBadge: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: COLORS.badgeGreen,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.badgeGreenText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailList: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowBody: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 2,
  },
});
