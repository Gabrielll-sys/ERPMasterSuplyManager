import api from './client';
import { AuthUser, LoginCredentials } from '../types';
import * as SecureStore from 'expo-secure-store';

export const authService = {
    /**
     * Realiza login e armazena credenciais de forma segura
     */
    login: async (credentials: LoginCredentials): Promise<AuthUser> => {
        const response = await api.post('/Usuarios/authenticate', {
            email: credentials.email,
            senha: credentials.senha,
        });

        // Backend retorna: { jwtToken, userName, userId, role }
        const user: AuthUser = {
            token: response.data.jwtToken,
            userId: response.data.userId,
            userName: response.data.userName,
            role: response.data.role,
        };

        // Armazena token e dados do usuário de forma segura
        await SecureStore.setItemAsync('authToken', user.token);
        await SecureStore.setItemAsync('authUser', JSON.stringify(user));

        return user;
    },

    /**
     * Remove credenciais armazenadas
     */
    logout: async (): Promise<void> => {
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('authUser');
    },

    /**
     * Recupera usuário armazenado
     */
    getCurrentUser: async (): Promise<AuthUser | null> => {
        try {
            const userString = await SecureStore.getItemAsync('authUser');
            if (userString) {
                return JSON.parse(userString) as AuthUser;
            }
        } catch (error) {
            console.error('Erro ao recuperar usuário:', error);
        }
        return null;
    },

    /**
     * Verifica se há um usuário autenticado
     */
    isAuthenticated: async (): Promise<boolean> => {
        const token = await SecureStore.getItemAsync('authToken');
        return !!token;
    },
};
