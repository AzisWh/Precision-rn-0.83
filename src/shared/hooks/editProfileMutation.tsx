import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '../../type/api';
import {
  ProfileUpdateRequest,
  UserProfile,
} from '../../features/login/type/auth';
import { updateProfile } from '../service/editProfileService';

export const PROFILE_KEYS = {
  all: ['myProfile'] as const,
};

export const useUpdateProfileMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UserProfile>, ApiError, ProfileUpdateRequest>({
    mutationFn: req => {
      console.log('[updateProfile] id yang dikirim:', id);
      console.log('[updateProfile] payload:', req);
      return updateProfile(id, req);
    },
    onSuccess: response => {
      console.log('[updateProfile] berhasil:', response.data);
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
    onError: error => {
      console.log(
        '[updateProfile] gagal — status:',
        error.status,
        '| pesan:',
        error.message,
      );
    },
  });
};
