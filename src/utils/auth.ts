import { Admin } from '@/types/auth';

// Token management
export const TOKEN_KEY = 'adminToken';
export const ADMIN_DATA_KEY = 'adminData';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getAdminData = (): Admin | null => {
  const adminData = localStorage.getItem(ADMIN_DATA_KEY);
  return adminData ? JSON.parse(adminData) : null;
};

export const setAdminData = (admin: Admin): void => {
  localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(admin));
};

export const removeAdminData = (): void => {
  localStorage.removeItem(ADMIN_DATA_KEY);
};

export const clearAuthData = (): void => {
  removeToken();
  removeAdminData();
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  const adminData = getAdminData();
  
  if (!token || !adminData) {
    return false;
  }
  
  if (isTokenExpired(token)) {
    clearAuthData();
    return false;
  }
  
  return true;
};

// Axios interceptor setup - Updated to work with Redux
export const setupAxiosInterceptors = (logoutCallback: () => void, getTokenFromStore: () => string | null) => {
  return {
    request: (config: any) => {
      const token = getTokenFromStore();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    responseError: (error: any) => {
      if (error.response?.status === 401) {
        logoutCallback();
      }
      return Promise.reject(error);
    }
  };
};
