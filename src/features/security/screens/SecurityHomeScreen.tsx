import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../constant/color';
import Button from '../../../components/Button';
import useLogout from '../../../features/settings/hooks/logoutHooks';
import DataListSecurity from '../components/DataListSecurity';

const SecurityHomeScreen = () => {
  return (
    <View style={styles.container}>
      <DataListSecurity />
    </View>
  );
};

export default SecurityHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
