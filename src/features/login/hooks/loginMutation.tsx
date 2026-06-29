import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../../context/AuthContext';
import { ROUTES, RootStackParamList } from '../../../routes';
import { ApiError } from '../../../type/api';
import { LoginRequest, LoginResponse } from '../type/login';
import { loginApi } from '../services/authService';
import { supabase } from '../../../lib/supabase';

export const useLoginMutation = () => {
  const { setToken, setRole, setProfile } = useAuth();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: loginApi,
    onSuccess: async response => {
      const { token, role, phone, full_name } = response.data;
      console.log('[login] data diterima dari server:', {
        phone,
        role,
        full_name,
        token,
      });
      console.log('[login] simpan role ke context & lanjut ke PIN:', role);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setToken(token);
      setRole(role);
      setProfile({
        id: user?.id ?? '',
        phone,
        full_name,
        role,
        is_active: true,
      });

      navigation.replace(ROUTES.PIN, { token });
    },
  });
};
