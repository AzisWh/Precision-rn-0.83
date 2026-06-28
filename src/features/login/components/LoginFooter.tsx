import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import CardBox from '../../../components/CardBox';
import { COLORS } from '../../../constant/color';

const LoginFooter = () => {
  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <CardBox
          text="secure ledger protocol"
          widthRatio={0.448}
          bgColor={COLORS.footerButtonBg}
          height={104}
          iconName="shield-checkmark-sharp"
          iconFamily="Ionicons"
          iconSize={24}
          textColor={COLORS.brand}
        />
        <CardBox
          text="v.4.2.0 enterprise"
          widthRatio={0.448}
          bgColor={COLORS.footerButtonBg}
          height={104}
          iconName="terminal"
          iconFamily="MaterialIcons"
          iconSize={24}
          textColor={COLORS.brand}
        />
      </View>
      <Text style={styles.text}>
        Authorized Personnel Only. Access is logged and monitored
      </Text>
    </View>
  );
};

export default LoginFooter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.footerBackground,
    paddingVertical: 16,
    alignItems: 'center',
    // marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 8,
  },
  boxContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  text: {
    color: COLORS.textDark,
    fontSize: 13,
    fontWeight: 'normal',
    paddingHorizontal: 8,
    textAlign: 'center',
  },
});
