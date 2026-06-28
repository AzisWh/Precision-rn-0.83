import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../../../constant/color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DOT_SIZE = SCREEN_WIDTH * 0.035;

type PinDotsProps = {
  pinLength: number;
  filledCount: number;
  dotAnims: Animated.Value[];
  shakeAnim: Animated.Value;
};

const PinDots = ({
  pinLength,
  filledCount,
  dotAnims,
  shakeAnim,
}: PinDotsProps) => {
  return (
    <Animated.View
      style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}
    >
      {Array.from({ length: pinLength }).map((_, i) => {
        const scale = dotAnims[i].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        });
        const isFilled = i < filledCount;
        return (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: isFilled ? COLORS.brand : COLORS.lightGray,
                transform: [{ scale }],
              },
            ]}
          />
        );
      })}
    </Animated.View>
  );
};

export default PinDots;

const styles = StyleSheet.create({
  dotsRow: {
    flexDirection: 'row',
    gap: SCREEN_WIDTH * 0.045,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});
