"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenValid } from '@/app/services/Auth.services';

interface AuthContextType {
  user: any;
  login: (token: string, userId: number, userName: string, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação ao iniciar
    checkAuth();

    // Configurar intervalo para verificar o token periodicamente
    const interval = setInterval(checkAuth, 60000); // Verifica a cada minuto

    return () => clearInterval(interval);
  }, []);

  const checkAuth = () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (isTokenValid(parsedUser.token)) {
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        // Token expirado, fazer logout
        handleLogout();
      }
    }
  };

  const handleLogin = (token: string, userId: number, userName: string, role: string) => {
    const userData = {
      token,
      userId,
      userName,
      role,
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 