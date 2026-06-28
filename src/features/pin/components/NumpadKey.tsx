import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../constant/color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const KEY_SIZE = SCREEN_WIDTH * 0.22;

type NumpadKeyProps =
  | {
      type: 'number';
      label: string;
      sub: string;
      onPress: () => void;
    }
  | {
      type: 'backspace';
      onPress: () => void;
    }
  | {
      type: 'fingerprint';
      iconColor: string;
      scanning: boolean;
      pulseAnim: Animated.Value;
      pulseOpacity: Animated.Value;
      rotate: Animated.AnimatedInterpolation<string>;
      onPress: () => void;
    };

const NumpadKey = (props: NumpadKeyProps) => {
  if (props.type === 'fingerprint') {
    return (
      <TouchableOpacity
        style={styles.key}
        onPress={props.onPress}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.fingerprintWrapper,
            {
              transform: [{ scale: props.pulseAnim }],
              opacity: props.pulseOpacity,
            },
          ]}
        >
          {props.scanning && (
            <Animated.View
              style={[
                styles.scanRing,
                {
                  borderColor: props.iconColor,
                  transform: [{ rotate: props.rotate }],
                },
              ]}
            />
          )}
          <Ionicons
            name="finger-print"
            size={SCREEN_WIDTH * 0.09}
            color={props.iconColor}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  }

  if (props.type === 'backspace') {
    return (
      <TouchableOpacity
        style={styles.key}
        onPress={props.onPress}
        activeOpacity={0.7}
      >
        <Ionicons
          name="backspace-outline"
          size={SCREEN_WIDTH * 0.075}
          color={COLORS.textDark}
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.keyBox}
      onPress={props.onPress}
      activeOpacity={0.75}
    >
      <Text style={styles.keyNumber}>{props.label}</Text>
      {props.sub !== '' && <Text style={styles.keySub}>{props.sub}</Text>}
    </TouchableOpacity>
  );
};

export default NumpadKey;

const styles = StyleSheet.create({
  keyBox: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    backgroundColor: COLORS.lightGray,
    borderRadius: SCREEN_WIDTH * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    opacity: 0.85,
  },
  keyNumber: {
    fontSize: SCREEN_WIDTH * 0.075,
    fontWeight: '500',
    color: COLORS.black,
    lineHeight: SCREEN_WIDTH * 0.085,
  },
  keySub: {
    fontSize: SCREEN_WIDTH * 0.025,
    color: COLORS.textDark,
    letterSpacing: 1.5,
    fontWeight: '500',
    marginTop: -2,
  },
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerprintWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scanRing: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.115,
    height: SCREEN_WIDTH * 0.115,
    borderRadius: SCREEN_WIDTH * 0.06,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
});
