import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../constant/color';

const StaffHomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Staff Home</Text>
  </View>
);

export default StaffHomeScreen;

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
