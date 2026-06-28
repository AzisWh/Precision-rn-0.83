import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../constant/color';
 
const { width: SCREEN_WIDTH } = Dimensions.get('window');
 
interface ImageCardProps {
  source: ImageSourcePropType;
  title: string;
  subtitle?: string;
  width?: number;
  height?: number;
  titleColor?: string;
  subtitleColor?: string;
  overlayColor?: string;
  borderRadius?: number;
  style?: ViewStyle;
}
 
const ImageCard: React.FC<ImageCardProps> = ({
  source,
  title,
  subtitle,
  width = SCREEN_WIDTH - 32,
  height = 160,
  titleColor = COLORS.white,
  subtitleColor = COLORS.white,
  overlayColor = 'rgba(0,0,0,0.45)',
  borderRadius = 16,
  style,
}) => {
  return (
    <View
      style={[
        styles.wrapper,
        { width, height, borderRadius },
        style,
      ]}
    >
      <ImageBackground
        source={source}
        style={styles.image}
        imageStyle={{ borderRadius }}
        resizeMode="cover"
      >
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: overlayColor, borderRadius },
          ]}
        />
 
        <View style={styles.content}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={2}>
            {title}
          </Text>
 
          {subtitle ? (
            <Text
              style={[styles.subtitle, { color: subtitleColor }]}
              numberOfLines={3}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </ImageBackground>
    </View>
  );
};
 
const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 16,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    opacity: 0.9,
  },
});
 
export default ImageCard;