import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constant/color';

const HeaderTitle = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => console.log('sidebar open')}
          activeOpacity={0.7}
        >
          <IonIcons
            name="reorder-three-outline"
            size={22}
            color={COLORS.brand}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Precision Ledger</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => console.log('notif open')}
          activeOpacity={0.7}
        >
          <IonIcons name="notifications-sharp" size={22} color={COLORS.brand} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderTitle;

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
    fontWeight: '500',
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
