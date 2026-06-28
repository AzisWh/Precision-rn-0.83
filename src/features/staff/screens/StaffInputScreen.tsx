import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../constant/color';

const StaffInputScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Staff Input</Text>
  </View>
);

export default StaffInputScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
});
