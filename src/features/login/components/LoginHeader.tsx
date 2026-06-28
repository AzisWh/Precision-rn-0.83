import { View, Text, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../../constant/color';

const LoginHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AntDesign name="inbox" size={32} color={COLORS.white} />
      </View>
      <Text style={styles.text}>E-DN</Text>
      <Text style={styles.subtitle}>precision ledger access</Text>
    </View>
  );
};

export default LoginHeader;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: COLORS.brand,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: {
    color: COLORS.brand,
    fontSize: 40,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.black,
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
