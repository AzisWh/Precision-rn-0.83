import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import PinHeader from '../components/PinHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import PinNumpad from '../components/PinNumpad';
import PinFooter from '../components/PinFooter';
import { ScrollView } from 'react-native-gesture-handler';
import useRefresh from '../../../shared/hooks/useRefresh';
import ReactNativeBiometrics from 'react-native-biometrics';

export default function PinScreen() {
  const { refreshControl } = useRefresh(async () => {
    await new Promise<void>(r => setTimeout(r, 1500));
  });

  const rnBiometrics = new ReactNativeBiometrics();

  if (!rnBiometrics.isSensorAvailable()) {
    console.log('Biometric sensor is not available');
  }
  console.log('Biometric sensor is available');

  return (
    <SafeAreaView style={styles.container}>
      <PinHeader />
      <ScrollView
        refreshControl={refreshControl}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <PinNumpad />
        <PinFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
