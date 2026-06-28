import { View, Text, Dimensions } from 'react-native';
import useRefresh from '../../../shared/hooks/useRefresh';
import { ScrollView } from 'react-native-gesture-handler';
import HistoryHero from '../components/HistoryHero';
import HistoryListData from '../components/HistoryListData';

const HistoryScreens = () => {
  const { refreshControl } = useRefresh(async () => {
    await new Promise<void>(r => setTimeout(r, 1500)); // simulasi
  });
  // const { width: SCREEN_WIDTH } = Dimensions.get('window');

  return (
    <ScrollView refreshControl={refreshControl} style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <HistoryHero />
        <HistoryListData />
      </View>
    </ScrollView>
  );
};

export default HistoryScreens;
