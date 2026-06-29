import React from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../constant/color';
import DeliveryForm from '../components/DeliveryForm';
import { NewDeliveryInput } from '../type';

const StaffInputScreen = () => {
  // const handleSubmit = (data: NewDeliveryInput) => {
  //   console.log('[SIMULASI] new delivery payload:', data);
  //   Alert.alert(
  //     'Berhasil (simulasi)',
  //     `DN ${data.dn_code} dibuat dengan status ${data.status}.`,
  //   );
  // };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <DeliveryForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default StaffInputScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
});
