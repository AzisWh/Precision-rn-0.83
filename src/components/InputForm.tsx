import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardTypeOptions,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constant/color';

type InputFormProps = {
  label: string;
  secondLabel?: string;
  onSecondLabelPress?: () => void;
  placeholder: string;
  leftIcon: string;
  leftIconFamily?: 'AntDesign' | 'Ionicons';
  type: 'text' | 'password' | 'number';
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
};

const getKeyboardType = (type: InputFormProps['type']): KeyboardTypeOptions => {
  switch (type) {
    case 'number':
      return 'phone-pad';
    default:
      return 'default';
  }
};

const InputForm = ({
  label,
  secondLabel,
  onSecondLabelPress,
  placeholder,
  leftIcon,
  leftIconFamily = 'AntDesign',
  type,
  value,
  onChangeText,
  editable = true,
}: InputFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const LeftIconComponent =
    leftIconFamily === 'Ionicons' ? Ionicons : AntDesign;

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {secondLabel && (
          <TouchableOpacity onPress={onSecondLabelPress} activeOpacity={0.7}>
            <Text style={styles.secondLabel}>{secondLabel}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputContainer}>
        <LeftIconComponent
          name={leftIcon}
          size={20}
          color={COLORS.placeholder}
          style={styles.leftIcon}
        />
        <TextInput
          style={[styles.input, !editable && styles.inputDisabled]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={getKeyboardType(type)}
          autoCapitalize="none"
          editable={editable}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={COLORS.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InputForm;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  secondLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    height: '100%',
    padding: 0,
  },
  inputDisabled: {
    color: COLORS.textSecondary,
  },
  eyeButton: {
    padding: 4,
  },
});
