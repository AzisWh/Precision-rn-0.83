import React from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const KEY_SIZE = SCREEN_WIDTH * 0.22;

type FaceIdKeyProps = {
  iconColor: string;
  scanning: boolean;
  pulseAnim: Animated.Value;
  onPress: () => void;
};

const FaceIdKey = ({
  iconColor,
  scanning,
  pulseAnim,
  onPress,
}: FaceIdKeyProps) => {
  return (
    <TouchableOpacity style={styles.key} onPress={onPress} activeOpacity={0.7}>
      <Animated.View
        style={[styles.wrapper, { transform: [{ scale: pulseAnim }] }]}
      >
        <MaterialCommunityIcons
          name="face-recognition"
          size={SCREEN_WIDTH * 0.09}
          color={iconColor}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default FaceIdKey;

const styles = StyleSheet.create({
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
