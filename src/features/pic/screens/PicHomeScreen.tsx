import { StyleSheet, View } from 'react-native';
import DataListPic from '../components/DataListPic';

const PicHomeScreen = () => {
  return (
    <View style={styles.container}>
      <DataListPic />
    </View>
  );
};

export default PicHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
