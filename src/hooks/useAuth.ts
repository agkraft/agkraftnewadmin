import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, logoutUser, clearError, updateProfile } from '@/store/slices/authSlice';

// Custom hook for authentication
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = ({ email, password }: { email: string; password: string }) => {
    dispatch(loginUser({ email, password }));
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const updateUserProfile = (data: any) => {
    dispatch(updateProfile(data));
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    logout,
    clearError: clearAuthError,
    updateProfile: updateUserProfile,
  };
};

// Hook for getting user data
export const useUser = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  return {
    user,
    isAuthenticated,
    fullName: user ? `${user.firstname} ${user.lastname}` : '',
    isAdmin: user?.role === 'admin',
    isVerified: user?.isVerified && user?.otpVerified,
    isActive: user?.isActive,
  };
};

// Hook for protected routes
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect: !isLoading && !isAuthenticated,
  };
};
