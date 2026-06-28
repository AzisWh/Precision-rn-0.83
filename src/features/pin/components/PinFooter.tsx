import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../constant/color';

const PinFooter = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>standart keamanan</Text>
        <Text style={styles.subTitle}>
          ISO 27001 Certified Enterprise System
        </Text>
      </View>
      <View style={styles.badge}>
        <Ionicons
          name="shield-checkmark-sharp"
          size={16}
          color={COLORS.brand}
        />
        <Text style={styles.text}>stratos shield active</Text>
      </View>
    </View>
  );
};

export default PinFooter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  textContainer: {
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#e6e7e9',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    color: COLORS.primary,
  },
  subTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  text: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
