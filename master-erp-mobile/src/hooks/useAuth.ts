import { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { authService } from '../api/auth.service';
import { AuthUser, LoginCredentials } from '../types';

/**
 * Hook customizado para gerenciar autenticação
 */
export function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Carrega usuário do storage ao montar
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            const loggedUser = await authService.login(credentials);
            setUser(loggedUser);
            setIsAuthenticated(true);
            return loggedUser;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
            // Redireciona para a tela de login após sair
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Erro no logout:', error);
            throw error;
        }
    }, []);

    return {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
    };
}
