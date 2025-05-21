import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User, type LoginRequest, type RegisterRequest, userService } from '../services/userService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<User>;
  register: (userData: RegisterRequest) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = userService.getCurrentUser();
    setCurrentUser(user);
    setIsAuthenticated(!!user);
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<User> => {
    try {
      const user = await userService.login(credentials);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<User> => {
    try {
      const user = await userService.register(userData);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    userService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
