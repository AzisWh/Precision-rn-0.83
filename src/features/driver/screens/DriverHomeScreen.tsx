import { View, StyleSheet } from 'react-native';
import DataListDriver from '../components/DataListDriver';

const DriverHomeScreen = () => {
  return (
    <View style={styles.container}>
      <DataListDriver />
    </View>
  );
};

export default DriverHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
