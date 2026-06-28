import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginHeader from '../components/LoginHeader';
import LoginForm from '../components/LoginForm';
import LoginFooter from '../components/LoginFooter';
import { ScrollView } from 'react-native-gesture-handler';
import useRefresh from '../../../shared/hooks/useRefresh';

export default function LoginScreen() {
  const { refreshControl } = useRefresh(async () => {
    await new Promise<void>(r => setTimeout(r, 1500)); 
  });
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={refreshControl}>
        <LoginHeader />
        <LoginForm />
        <LoginFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
