export const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';
export const imageUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001'}/uploads/`;

// Auth API endpoints
export const authEndpoints = {
  login: `${baseUrl}/api/auth/login-email`,
  profile: `${baseUrl}/api/auth/profile`,
  logout: `${baseUrl}/api/auth/logout`,
};
