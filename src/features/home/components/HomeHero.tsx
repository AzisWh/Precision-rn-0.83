import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../../constant/color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeHero = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.statusText}>System Status: Active</Text>
        <Text style={styles.title} numberOfLines={2}>
          Active {'\n'}delivery notes
        </Text>
      </View>
      <View style={styles.boxContainer}>
        <Text style={styles.boxTitle}>
          Review and manage all pending and intransit delivery logistics for
          sector 7
        </Text>
        <View style={styles.secureSession}>
          <View style={styles.dot} />
          <Text style={styles.secureText}>live updates enabled</Text>
        </View>
      </View>
    </View>
  );
};

export default HomeHero;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: SCREEN_WIDTH * 0.06,
    gap: 16,
  },
  textContainer: {
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 8,
    color: COLORS.brand,
  },
  boxContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: 120,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 24,
    gap: 16,
    alignSelf: 'center',
  },
  boxTitle: {
    fontSize: 16,
    color: COLORS.black,
    textTransform: 'capitalize',
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
    width: '80%',
    color: COLORS.brand,
    fontWeight: '400',
    textTransform: 'uppercase',
  },
});
