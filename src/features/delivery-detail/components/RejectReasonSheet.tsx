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
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../constant/color';

type RejectReasonSheetProps = {
  visible: boolean;
  rejectBy: string;
  reason: string;
  onChangeReason: (text: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isPending?: boolean;
};

const RejectReasonSheet = ({
  visible,
  rejectBy,
  reason,
  onChangeReason,
  onClose,
  onSubmit,
  isPending = false,
}: RejectReasonSheetProps) => {
  const inputRef = useRef<TextInput>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus input alasan setelah animasi slide selesai
  useEffect(() => {
    if (visible) {
      if (focusTimer.current) clearTimeout(focusTimer.current);
      focusTimer.current = setTimeout(() => inputRef.current?.focus(), 350);
    }
    return () => {
      if (focusTimer.current) clearTimeout(focusTimer.current);
    };
  }, [visible]);

  const canSubmit = reason.trim().length > 0 && !isPending;

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
            disabled={isPending}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.sheetHeaderBtn}
          >
            <Text style={styles.sheetCancel}>Batal</Text>
          </TouchableOpacity>

          <Text style={styles.sheetTitle}>Reject Pengiriman</Text>

          <TouchableOpacity
            onPress={onSubmit}
            disabled={!canSubmit}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.sheetHeaderBtn}
          >
            {isPending ? (
              <ActivityIndicator size="small" color={COLORS.error} />
            ) : (
              <Text
                style={
                  canSubmit ? styles.sheetSubmitActive : styles.sheetSubmitDisabled
                }
              >
                Reject
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Body */}
        <ScrollView
          style={styles.sheetBody}
          contentContainerStyle={styles.sheetBodyContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.helperText}>
            Isi alasan penolakan. Data langsung tersimpan dan terbarui otomatis.
          </Text>

          {/* Reject By — read-only (nama security yang menolak) */}
          <Text style={styles.inputLabel}>Reject By</Text>
          <View style={styles.readOnlyField}>
            <Ionicons
              name="lock-closed"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text
              style={[
                styles.readOnlyValue,
                !rejectBy && styles.readOnlyPlaceholder,
              ]}
              numberOfLines={1}
            >
              {rejectBy || '-'}
            </Text>
          </View>

          {/* Reject Reason — editable multiline */}
          <Text style={styles.inputLabel}>Reject Reason</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={reason}
            onChangeText={onChangeReason}
            placeholder="Tulis alasan reject..."
            placeholderTextColor={COLORS.placeholder}
            multiline
            textAlignVertical="top"
            maxLength={300}
            returnKeyType="done"
            blurOnSubmit
          />
          <Text style={styles.counter}>{reason.length}/300</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RejectReasonSheet;

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
  sheetSubmitActive: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.error,
    textAlign: 'right',
  },
  sheetSubmitDisabled: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.lightGray,
    textAlign: 'right',
  },
  sheetBody: {
    flex: 1,
  },
  sheetBodyContent: {
    padding: 20,
  },
  helperText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  readOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 20,
  },
  readOnlyValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  readOnlyPlaceholder: {
    color: COLORS.placeholder,
    fontWeight: '500',
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 120,
    backgroundColor: COLORS.white,
  },
  counter: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 6,
  },
});
