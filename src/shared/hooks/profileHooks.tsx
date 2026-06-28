import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '../../type/api';
import { UserProfile } from '../../features/login/type/auth';
import { getMyProfile } from '../service/getProfileService';

export const useMyProfile = () => {
  return useQuery<ApiResponse<UserProfile>, ApiError>({
    queryKey: ['myProfile'],
    queryFn: getMyProfile,
  });
};
