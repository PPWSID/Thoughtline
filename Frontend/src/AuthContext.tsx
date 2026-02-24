import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import userservice from './service/userservice';

interface User {
  id: string;
  name: string;
  user_name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          return {
            ...parsedUser,
            id: parsedUser.id || parsedUser._id
          };
        }
      }
    } catch (e) {
      console.error('Error initializing user from localStorage:', e);
    }
    return null;
  });

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setIsInitializing(false);
  }, []);

  const login = (userData: any) => {
    if (!userData) {
      console.error('Login failed: No user data provided');
      return;
    }
    
    const normalizedUser = {
      ...userData,
      id: userData.id || userData._id
    };
    setUser(normalizedUser);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  };

  const logout = async () => {
    try {
      await userservice.logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
