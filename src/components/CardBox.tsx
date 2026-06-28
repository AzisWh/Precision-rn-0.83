import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constant/color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CardBoxProps = {
  widthRatio?: number;
  height?: number;
  text: string;
  subtitle?: string;
  borderRadius?: number;
  iconName?: string;
  iconFamily?: 'AntDesign' | 'Ionicons' | 'MaterialIcons';
  iconSize?: number;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
};

const CardBox = ({
  widthRatio = 0.9,
  height,
  text,
  subtitle,
  borderRadius = 4,
  iconName,
  iconFamily = 'AntDesign',
  iconSize = 20,
  bgColor = COLORS.white,
  textColor = COLORS.textDark,
  borderColor = COLORS.border,
}: CardBoxProps) => {
  const IconComponent = iconFamily === 'Ionicons' ? Ionicons : iconFamily === 'MaterialIcons' ? MaterialIcons : AntDesign;

  return (
    <View
      style={[
        styles.container,
        {
          height,
          borderRadius,
          backgroundColor: bgColor,
          width: SCREEN_WIDTH * widthRatio,
          borderColor,
        },
      ]}
    >
      {iconName && (
        <IconComponent
          name={iconName}
          size={iconSize}
          color={textColor}
          style={styles.icon}
        />
      )}
      <Text
        style={[styles.title, { color: textColor }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {text}
      </Text>
      {subtitle && (
        <Text
          style={[styles.subtitle, { color: textColor }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};

export default CardBox;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    display: 'flex',
    flexDirection: 'column',
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  subtitle: {
    textTransform: 'uppercase',
    fontSize: 11,
    fontWeight: '400',
    opacity: 0.7,
    marginTop: 2,
    flexWrap: 'wrap',
  },
});
