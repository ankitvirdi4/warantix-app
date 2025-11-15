import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { login as loginRequest, signup as signupRequest } from '../api/auth';
import type { AuthResponse } from '../api/auth';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'warrantrix_token';
const USER_STORAGE_KEY = 'warrantrix_user';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem(USER_STORAGE_KEY);
    return cached ? (JSON.parse(cached) as User) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const handleAuthSuccess = useCallback((data: AuthResponse) => {
    setToken(data.access_token);
    setUser(data.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const data = await loginRequest({ email, password });
        handleAuthSuccess(data);
        navigate('/dashboard', { replace: true });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message =
            (error.response?.data as { detail?: string } | undefined)?.detail ??
            error.response?.statusText ??
            error.message;
          throw new Error(message || 'Authentication failed');
        }
        throw error;
      }
    },
    [handleAuthSuccess, navigate]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const data = await signupRequest({ name, email, password });
        handleAuthSuccess(data);
        navigate('/dashboard', { replace: true });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message =
            (error.response?.data as { detail?: string } | undefined)?.detail ??
            error.response?.statusText ??
            error.message;
          throw new Error(message || 'Sign up failed');
        }
        throw error;
      }
    },
    [handleAuthSuccess, navigate]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      signup,
      logout
    }),
    [login, logout, signup, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
