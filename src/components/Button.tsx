import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constant/color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ButtonProps = {
  title: string;
  onPress: () => void;
  bgColor?: string;
  textColor?: string;
  widthRatio?: number;
  height?: number;
  borderRadius?: number;
  fontSize?: number;
  rightIcon?: string;
  iconFamily?: 'AntDesign' | 'Ionicons';
  iconSize?: number;
  disabled?: boolean;
};

const Button = ({
  title,
  onPress,
  bgColor = COLORS.brand,
  textColor = COLORS.white,
  widthRatio = 0.9,
  height = 48,
  borderRadius = 8,
  fontSize = 16,
  rightIcon,
  iconFamily = 'AntDesign',
  iconSize = 18,
  disabled = false,
}: ButtonProps) => {
  const IconComponent = iconFamily === 'Ionicons' ? Ionicons : AntDesign;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? COLORS.disabled : bgColor,
          width: SCREEN_WIDTH * widthRatio,
          height,
          borderRadius,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: textColor, fontSize }]}>{title}</Text>
      {rightIcon && (
        <IconComponent
          name={rightIcon}
          size={iconSize}
          color={textColor}
          style={styles.icon}
        />
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  icon: {
    marginLeft: 8,
  },
});
