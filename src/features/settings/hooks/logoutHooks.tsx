import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../../context/AuthContext';
import { ROUTES, RootStackParamList } from '../../../routes';
import { logoutApi } from '../service/logoutService';

const useLogout = () => {
  const { logout } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await logoutApi();
      logout();
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.LOGIN }],
      });
    } catch {
      console.log('Logout gagal');
    } finally {
      setIsPending(false);
    }
  };

  return { handleLogout, isPending };
};

export default useLogout;
