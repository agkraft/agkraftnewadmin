export interface Admin {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  isVerified: boolean;
  otpVerified: boolean;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    message: string;
    admin: Admin;
    token: string;
  };
}

export interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface ApiError {
  success: false;
  message: string;
}
