import axios from 'axios';
import { store } from '@/store/store';
import { logoutUser } from '@/store/slices/authSlice';

// Setup axios interceptors
export const setupAxiosInterceptors = () => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const { token } = state.auth;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - simple approach
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Only logout on 401 for auth endpoints
      if (error.response?.status === 401) {
        const url = error.config?.url || '';
        
        // Only auto-logout on auth-related endpoints
        if (url.includes('/auth/') || url.includes('/profile')) {
          store.dispatch(logoutUser());
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};
