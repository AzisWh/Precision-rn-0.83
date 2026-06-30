import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { COLORS } from '../../../constant/color';

export type FieldConfig = {
  key: 'full_name' | 'phone';
  label: string;
  icon: string;
  keyboardType?: 'default' | 'phone-pad';
  maxLength?: number;
  // false => baris tampil terkunci (read-only), tidak bisa dibuka/diedit.
  editable?: boolean;
};

type EditFieldSheetProps = {
  visible: boolean;
  field: FieldConfig;
  value: string;
  initialValue: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onSave: () => void;
};

const EditFieldSheet = ({
  visible,
  field,
  value,
  initialValue,
  onChangeText,
  onClose,
  onSave,
}: EditFieldSheetProps) => {
  const inputRef = useRef<TextInput>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus input setelah animasi slide selesai
  useEffect(() => {
    if (visible) {
      if (focusTimer.current) clearTimeout(focusTimer.current);
      focusTimer.current = setTimeout(() => inputRef.current?.focus(), 350);
    }
    return () => {
      if (focusTimer.current) clearTimeout(focusTimer.current);
    };
  }, [visible]);

  const isChanged = value.trim() !== initialValue.trim();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.sheet}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header sheet */}
        <View style={styles.sheetHeader}>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.sheetHeaderBtn}
          >
            <Text style={styles.sheetCancel}>Batal</Text>
          </TouchableOpacity>

          <Text style={styles.sheetTitle}>{field.label}</Text>

          <TouchableOpacity
            onPress={onSave}
            disabled={!isChanged}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.sheetHeaderBtn}
          >
            <Text
              style={isChanged ? styles.sheetSaveActive : styles.sheetSaveDisabled}
            >
              Simpan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Body */}
        <View style={styles.sheetBody}>
          <Text style={styles.inputLabel}>{field.label}</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            keyboardType={field.keyboardType}
            maxLength={field.maxLength}
            placeholder={field.label}
            placeholderTextColor={COLORS.placeholder}
            returnKeyType="done"
            blurOnSubmit
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditFieldSheet;

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sheetHeaderBtn: {
    minWidth: 56,
  },
  sheetTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  sheetCancel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.brand,
  },
  sheetSaveActive: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.brand,
    textAlign: 'right',
  },
  sheetSaveDisabled: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.lightGray,
    textAlign: 'right',
  },
  sheetBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
  },
});
