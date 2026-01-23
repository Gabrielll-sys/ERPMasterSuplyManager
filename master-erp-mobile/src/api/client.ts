import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// CONFIGURAÇÃO DA API
// Expo Go: Use o IP da sua máquina na rede local (celular precisa estar no mesmo WiFi)
// Emulador Android: Use 10.0.2.2:5285 (porta especial do emulador)
// Emulador iOS: Use localhost:5285
// Para encontrar seu IP: ipconfig (Windows) ou ifconfig (Mac/Linux)

const API_BASE_URL = 'http://192.168.2.120:5285/api/v1'; // IP da máquina detectado

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - adiciona token JWT
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Erro ao recuperar token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - trata erros globalmente
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expirado ou inválido
            try {
                await SecureStore.deleteItemAsync('authToken');
                await SecureStore.deleteItemAsync('authUser');
                // TODO: Redirecionar para tela de login
            } catch (e) {
                console.error('Erro ao limpar dados de auth:', e);
            }
        }

        // Log do erro para debug
        console.error('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
        });

        return Promise.reject(error);
    }
);

export default api;
export { API_BASE_URL };
