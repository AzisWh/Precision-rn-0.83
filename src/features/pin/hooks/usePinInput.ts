import { useState, useRef } from 'react';
import { Animated } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const PIN_LENGTH = 6;

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const usePinInput = () => {
  const [pin, setPin] = useState<string[]>([]);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const dotAnims = useRef(
    Array.from({ length: PIN_LENGTH }, () => new Animated.Value(0)),
  ).current;

  const animateDotIn = (index: number) => {
    Animated.spring(dotAnims[index], {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  const animateDotOut = (index: number) => {
    Animated.spring(dotAnims[index], {
      toValue: 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const triggerShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = (value: string) => {
    if (pin.length >= PIN_LENGTH) return;

    ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
    // console.log(
    //   `PIN press: "${value}" — PIN sekarang: ${[...pin, value].join('')}`,
    // );

    const newPin = [...pin, value];
    setPin(newPin);
    animateDotIn(newPin.length - 1);
  };

  const handleBackspace = () => {
    if (pin.length === 0) return;

    ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
    // console.log(`Backspace — PIN sekarang: ${pin.slice(0, -1).join('')}`);

    animateDotOut(pin.length - 1);
    setPin(prev => prev.slice(0, -1));
  };

  const clearPin = () => {
    pin.forEach((_, i) => animateDotOut(i));
    setPin([]);
  };

  const resetPin = () => {
    triggerShake();
    setTimeout(() => {
      clearPin();
    }, 400);
  };

  const isFull = pin.length === PIN_LENGTH;

  return {
    pin,
    PIN_LENGTH,
    shakeAnim,
    dotAnims,
    isFull,
    handlePress,
    handleBackspace,
    resetPin,
    triggerShake,
  };
};

export default usePinInput;
