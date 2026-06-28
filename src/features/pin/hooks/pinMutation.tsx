import { useMutation } from '@tanstack/react-query';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { VerifyPinRequest, VerifyPinResponse } from '../type/pin';
import { ApiError } from '../../../type/api';
import { verifyPinApi } from '../services/pinServices';

export const useVerifyPinMutation = () => {
  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  return useMutation<VerifyPinResponse, ApiError, VerifyPinRequest>({
    mutationFn: verifyPinApi,
    onSuccess: () => {
      ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
    },
    onError: () => {
      ReactNativeHapticFeedback.trigger('notificationError', hapticOptions);
    },
  });
};