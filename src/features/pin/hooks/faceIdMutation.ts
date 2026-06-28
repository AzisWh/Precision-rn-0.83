import { useRef, useState } from 'react';
import { Animated } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

const useFaceId = (onFail?: () => void, onSuccess?: () => void) => {
  const [scanning, setScanning] = useState(false);
  const [iconColor, setIconColor] = useState('#888');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handleScan = async () => {
    if (scanning) return;
    setScanning(true);
    setIconColor('#3B82F6');

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 },
    ).start();

    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Login dengan Face ID',
        cancelButtonText: 'Batal',
      });

      console.log('Face ID result:', success);
console.log('onSuccess exists:', !!onSuccess);

      if (success) {
        setIconColor('#22C55E'); // hijau
        onSuccess?.();
      } else {
        setIconColor('#EF4444'); // merah
        onFail?.();
      }
    } catch {
      setIconColor('#EF4444');
      onFail?.();
    } finally {
      setScanning(false);
      setTimeout(() => setIconColor('#888'), 1500);
    }
  };

  return { scanning, iconColor, pulseAnim, handleScan };
};

export default useFaceId;