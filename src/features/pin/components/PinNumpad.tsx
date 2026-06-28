import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Button from '../../../components/Button';
import { COLORS } from '../../../constant/color';
import usePinInput from '../hooks/usePinInput';
import useFingerprint from '../hooks/useFingerprint';
import PinDots from './PinDots';
import NumpadKey from './NumpadKey';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useVerifyPinMutation } from '../hooks/pinMutation';
import { ROUTES, RootStackParamList } from '../../../routes';
import { getRoleTabRoute } from '../../../shared/utils/getRoleTabRoute';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../../context/AuthContext';
import useFaceId from '../hooks/faceIdMutation';
import FaceIdKey from './FaceIdKey';

type PinScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof ROUTES.PIN
>;

type PinScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.PIN>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NUMPAD = [
  [
    { label: '1', sub: '' },
    { label: '2', sub: 'ABC' },
    { label: '3', sub: 'DEF' },
  ],
  [
    { label: '4', sub: 'GHI' },
    { label: '5', sub: 'JKL' },
    { label: '6', sub: 'MNO' },
  ],
  [
    { label: '7', sub: 'PQRS' },
    { label: '8', sub: 'TUV' },
    { label: '9', sub: 'WXYZ' },
  ],
  [
    { label: 'fingerprint', sub: '' },
    { label: '0', sub: '+' },
    { label: 'backspace', sub: '' },
  ],
];

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const PinNumpad = () => {
  const {
    pin,
    PIN_LENGTH,
    shakeAnim,
    dotAnims,
    isFull,
    handlePress,
    handleBackspace,
    resetPin,
    triggerShake,
  } = usePinInput();

  const navigation = useNavigation<PinScreenNavigationProp>();
  // const { token } = useRoute<PinScreenRouteProp>().params;
  const { mutate: verifyPin, isPending } = useVerifyPinMutation();

  // const fingerprint = useFingerprint(triggerShake);

  const { setPinVerified, auth } = useAuth();
  const faceId = useFaceId(triggerShake, setPinVerified);

  // const handleLanjutkan = () => {
  //   if (!isFull) return;

  //   ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
  //   console.log(`Submit PIN: ${pin.join('')}`);

  //   const isCorrect = pin.join('') === '123456';
  //   if (!isCorrect) {
  //     ReactNativeHapticFeedback.trigger('notificationError', hapticOptions);
  //     resetPin();
  //     console.log('PIN salah!');
  //   } else {
  //     console.log('PIN benar! Navigate ke home...');
  //   }
  // };

  const renderKey = (key: { label: string; sub: string }) => {
    // if (key.label === 'fingerprint') {
    //   return (
    //     <NumpadKey
    //       key="fingerprint"
    //       type="fingerprint"
    //       iconColor={fingerprint.iconColor}
    //       scanning={fingerprint.scanning}
    //       pulseAnim={fingerprint.pulseAnim}
    //       pulseOpacity={fingerprint.pulseOpacity}
    //       rotate={fingerprint.rotate}
    //       onPress={fingerprint.handleScan}
    //     />
    //   );
    // }
    if (key.label === 'fingerprint') {
      return (
        <FaceIdKey
          key="faceid"
          iconColor={faceId.iconColor}
          scanning={faceId.scanning}
          pulseAnim={faceId.pulseAnim}
          onPress={faceId.handleScan}
        />
      );
    }

    if (key.label === 'backspace') {
      return (
        <NumpadKey key="backspace" type="backspace" onPress={handleBackspace} />
      );
    }

    return (
      <NumpadKey
        key={key.label}
        type="number"
        label={key.label}
        sub={key.sub}
        onPress={() => handlePress(key.label)}
      />
    );
  };

  // console.log('auth state:', auth);

  const handleLanjutkan = () => {
    if (!isFull) return;
    ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);

    verifyPin(
      { pin: pin.join(''), token: auth.token ?? '' },
      {
        onSuccess: res => {
          setPinVerified();
        },
        onError: () => {
          Alert.alert('PIN salah, silakan coba lagi');
          resetPin();
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="lock-reset" size={32} color={COLORS.brand} />
        </View>
        <Text style={styles.heading}>Masukkan PIN</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          Masukkan 6 digit PIN Anda untuk melanjutkan
        </Text>
      </View>
      <PinDots
        pinLength={PIN_LENGTH}
        filledCount={pin.length}
        dotAnims={dotAnims}
        shakeAnim={shakeAnim}
      />

      <View style={styles.numpad}>
        {NUMPAD.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(key => renderKey(key))}
          </View>
        ))}
      </View>

      <View style={{ alignItems: 'center', gap: 12, marginTop: 32 }}>
        <Button
          title="Lanjutkan"
          onPress={() => navigation.replace(getRoleTabRoute(auth.role))}
          // disabled={!isFull || isPending}
          bgColor={COLORS.brand}
          widthRatio={0.88}
          height={52}
          borderRadius={10}
          fontSize={16}
        />
        {/* <Button
          title="Lanjutkan"
          onPress={handleLanjutkan}
          disabled={!isFull || isPending}
          bgColor={COLORS.brand}
          widthRatio={0.88}
          height={52}
          borderRadius={10}
          fontSize={16}
        /> */}
        <Text style={styles.text}>Data Anda terlindungi enkripsi aes-256</Text>
      </View>
    </View>
  );
};

export default PinNumpad;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SCREEN_WIDTH * 0.03,
    paddingVertical: 24,
  },
  numpad: {
    gap: SCREEN_WIDTH * 0.03,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: SCREEN_WIDTH * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  content: {
    marginTop: 24,
    paddingLeft: 4,
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
