import { useState, useRef } from 'react';
import { Animated } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { COLORS } from '../../../constant/color';

type FingerprintStatus = 'idle' | 'scanning' | 'success' | 'error';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const useFingerprint = (onError?: () => void) => {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<FingerprintStatus>('idle');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    pulseAnim.setValue(1);
    pulseOpacity.setValue(0.6);
    rotateAnim.setValue(0);

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.6,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
    ).start();
  };

  const stopAnimation = () => {
    pulseAnim.stopAnimation();
    pulseOpacity.stopAnimation();
    rotateAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(pulseOpacity, {
      toValue: 0.6,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleScan = () => {
    if (scanning) return;

    ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
    setScanning(true);
    setStatus('scanning');
    startAnimation();

    console.log('Fingerprint scanning...');

    setTimeout(() => {
      stopAnimation();
      const isSuccess = Math.random() > 0.3;

      if (isSuccess) {
        setStatus('success');
        ReactNativeHapticFeedback.trigger(
          'notificationSuccess',
          hapticOptions,
        );
        console.log('Fingerprint: SUCCESS');
      } else {
        setStatus('error');
        ReactNativeHapticFeedback.trigger('notificationError', hapticOptions);
        onError?.();
        console.log('Fingerprint: FAILED');
      }

      setTimeout(() => {
        setScanning(false);
        setStatus('idle');
      }, 1200);
    }, 2000);
  };

  const iconColor =
    status === 'scanning'
      ? COLORS.brand
      : status === 'success'
        ? COLORS.success
        : status === 'error'
          ? COLORS.error
          : COLORS.lightGray;

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return {
    scanning,
    status,
    iconColor,
    pulseAnim,
    pulseOpacity,
    rotate,
    handleScan,
  };
};

export default useFingerprint;
