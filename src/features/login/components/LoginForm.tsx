import { View, Text, StyleSheet, Alert } from 'react-native';
import InputForm from '../../../components/InputForm';
import { useState } from 'react';
import Button from '../../../components/Button';
import { COLORS } from '../../../constant/color';
import { useLoginMutation } from '../hooks/loginMutation';

const LoginForm = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { mutate: login, isPending } = useLoginMutation();

  const handleLogin = () => {
    setErrorMsg('');
    if (!phone || !password) {
      setErrorMsg('Nomor HP dan password harus diisi');
      return;
    }
    // Penyimpanan context (token/role/profile) & navigasi ke PIN
    // ditangani oleh useLoginMutation — di sini cuma handle error.
    login(
      { phone, password },
      {
        onError: err => {
          Alert.alert('Login Gagal', err.message);
          setErrorMsg(err.message);
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      {!!errorMsg && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
      <InputForm
        label="Nomor Handphone"
        placeholder="08xx xxxx xxxx"
        leftIcon="phone"
        leftIconFamily="AntDesign"
        type="number"
        value={phone}
        onChangeText={setPhone}
      />
      <InputForm
        label="Password"
        secondLabel="Lupa Password?"
        onSecondLabelPress={() => console.log('forgot')}
        placeholder="Masukkan password"
        leftIcon="lock1"
        leftIconFamily="AntDesign"
        type="password"
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title="Login"
        disabled={isPending}
        onPress={handleLogin}
        bgColor={COLORS.brand}
        textColor={COLORS.white}
        widthRatio={0.83}
        height={56}
        fontSize={18}
        borderRadius={8}
        rightIcon="arrow-forward-outline"
        iconFamily="Ionicons"
      />
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.brand,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  text: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
  },
});
