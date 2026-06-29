import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../constant/color';
import { ROUTES, RootStackParamList } from '../../../routes';
import { useMyProfile } from '../../../shared/hooks/profileHooks';
import { useUpdateProfileMutation } from '../../../shared/hooks/editProfileMutation';
import { ProfileUpdateRequest, UserProfile, UserRole } from '../../login/type/auth';
import { ErrorState, LoadingState } from '../../../components/StateComponents';
import EditFieldSheet, { FieldConfig } from '../components/EditFieldSheet';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Admin',
  staff: 'Staff',
  driver: 'Driver',
  pic: 'PIC',
  security: 'Security',
};

const FIELDS: FieldConfig[] = [
  {
    key: 'full_name',
    label: 'Nama Lengkap',
    icon: 'person',
    keyboardType: 'default',
  },
  { key: 'phone', label: 'Nomor HP', icon: 'phone', keyboardType: 'phone-pad' },
];

const TOAST_DURATION = 2000;

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.EDIT_PROFILE
>;

const EditProfileScreen = ({ navigation }: Props) => {
  const { data, isLoading, isError } = useMyProfile();
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
  const [activeField, setActiveField] = useState<FieldConfig | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [toast, setToast] = useState<{ message: string; icon: string } | null>(
    null,
  );

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (data?.data && !localProfile) {
      setLocalProfile(data.data);
    }
  }, [data, localProfile]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const updateProfileMutation = useUpdateProfileMutation(
    localProfile?.id ?? '',
  );

  if (isLoading) {
    return <LoadingState message="Memuat profil..." />;
  }

  if (isError || !localProfile) {
    return <ErrorState message="Profil gagal dimuat" />;
  }

  const initials =
    localProfile.full_name
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';

  const openField = (field: FieldConfig) => {
    setActiveField(field);
    setTempValue(localProfile[field.key] ?? '');
  };

  const handleCloseSheet = () => setActiveField(null);

  const showToast = (message: string, icon: string = 'check-circle') => {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), TOAST_DURATION);
  };

  const handleSave = () => {
    if (!activeField || !localProfile) return;

    const newValue = tempValue;
    const changedKey = activeField.key;
    const prevValue = localProfile[changedKey];

    // 1. Tutup bottom sheet
    setActiveField(null);

    // 2. Payload bertipe (Nama / Nomor HP)
    const payload: ProfileUpdateRequest =
      changedKey === 'full_name' ? { full_name: newValue } : { phone: newValue };

    // 3. Optimistic update
    setLocalProfile(prev =>
      prev ? { ...prev, [changedKey]: newValue } : prev,
    );

    // 4. Mutasi ke Supabase — rollback + toast sesuai hasil
    updateProfileMutation.mutate(payload, {
      onSuccess: () => showToast('Profil diperbarui', 'check-circle'),
      onError: () => {
        setLocalProfile(prev =>
          prev ? { ...prev, [changedKey]: prevValue } : prev,
        );
        showToast('Gagal memperbarui profil', 'error');
      },
    });
  };

  const sheetField = activeField ?? FIELDS[0];
  const sheetInitial = activeField ? localProfile[activeField.key] ?? '' : '';

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.headerSide}
        >
          <MaterialIcons
            name="arrow-back"
            size={26}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profil</Text>

        <View style={styles.headerSide}>
          <MaterialIcons name="edit" size={22} color={COLORS.brand} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{localProfile.full_name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {ROLE_LABEL[localProfile.role] ?? localProfile.role}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          {FIELDS.map((field, index) => (
            <View key={field.key}>
              <TouchableOpacity
                style={styles.fieldRow}
                onPress={() => openField(field)}
                activeOpacity={0.7}
              >
                <View style={styles.fieldIcon}>
                  <MaterialIcons
                    name={field.icon}
                    size={18}
                    color={COLORS.brand}
                  />
                </View>
                <View style={styles.fieldBody}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <Text style={styles.fieldValue} numberOfLines={1}>
                    {localProfile[field.key] || '-'}
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
              {index < FIELDS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </View>

      {toast && (
        <View style={styles.toastWrap} pointerEvents="none">
          <View style={styles.toast}>
            <MaterialIcons name={toast.icon} size={18} color={COLORS.white} />
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        </View>
      )}

      <EditFieldSheet
        visible={activeField !== null}
        field={sheetField}
        value={tempValue}
        initialValue={sheetInitial}
        onChangeText={setTempValue}
        onClose={handleCloseSheet}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  headerSide: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    paddingVertical: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingBottom: 20,
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  fieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldBody: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
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
  toastWrap: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.cardDark,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
  },
});
