import useRefresh from '../../../shared/hooks/useRefresh';
import { ScrollView } from 'react-native-gesture-handler';
import HomeHero from '../components/HomeHero';
import HomeSummary from '../components/HomeSummary';
import HomeListData from '../components/HomeListData';

const HomeScreen = () => {
  const { refreshControl } = useRefresh(async () => {
    await new Promise<void>(r => setTimeout(r, 1500)); // simulasi
  });

  return (
    <ScrollView refreshControl={refreshControl}>
      <HomeHero />
      <HomeSummary />
      <HomeListData />
    </ScrollView>
  );
};

export default HomeScreen;
