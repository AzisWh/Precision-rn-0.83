import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../../constant/color';

const PinHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <AntDesign name="arrowleft" size={22} color={COLORS.brand} />
        </TouchableOpacity>

        <Text style={styles.title}>Precision Ledger</Text>

        <View style={styles.secureSession}>
          <View style={styles.dot} />
          <Text style={styles.secureText}>Secure Session</Text>
        </View>
      </View>
    </View>
  );
};

export default PinHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.brand,
    flex: 1,
  },
  secureSession: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brand,
    marginRight: 6,
  },
  secureText: {
    fontSize: 12,
    color: COLORS.brand,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});
