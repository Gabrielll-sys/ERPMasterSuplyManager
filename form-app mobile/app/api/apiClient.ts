// Localização: app/api/apiClient.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
// Importe sua lógica de autenticação para obter o token
// Exemplo: import { getAuthToken } from '@/services/authService';

// Defina a URL base da sua API backend.
// É uma boa prática usar variáveis de ambiente para isso.
// Para desenvolvimento local, pode ser o endereço IP da sua máquina ou localhost (se usar encaminhamento de porta).
// NUNCA use localhost diretamente se estiver a testar num dispositivo físico,
// pois ele apontará para o próprio dispositivo. Use o IP da sua máquina na rede local.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.216:5285'; // Ex: 'http://192.168.1.10:5056' ou a porta que o Kestrel usa

console.log(`[apiClient] Usando API Base URL: ${API_BASE_URL}`);

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Adiciona o /api padrão às suas rotas
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Timeout de 15 segundos para requisições
});

// Interceptor de Requisição: Adiciona o token JWT a cada requisição
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // --- LÓGICA DE AUTENTICAÇÃO ---
    // Substitua esta parte pela sua forma real de obter o token JWT armazenado
    // const token = await getAuthToken(); // Exemplo
    const token = await AsyncStorage.getItem('userToken'); // Exemplo com AsyncStorage
    // console.log('[apiClient] Token a ser usado:', token ? 'Sim' : 'Não');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn('[apiClient] Token não encontrado para a requisição:', config.url);
        // Você pode querer cancelar a requisição ou lidar com isso de outra forma
        // se um token for estritamente necessário para o endpoint.
    }
    return config;
  },
  (error) => {
    console.error('[apiClient] Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor de Resposta: Lida com erros comuns (opcional, mas útil)
apiClient.interceptors.response.use(
  (response) => {
    // Qualquer status code dentro do range 2xx causa esta função ser disparada
    // console.log('[apiClient] Resposta recebida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Qualquer status code fora do range 2xx causa esta função ser disparada
    console.error('[apiClient] Erro na resposta da API:', error.response?.status, error.config?.url, error.message);

    if (error.response) {
      // A requisição foi feita e o servidor respondeu com um status code
      // fora do range 2xx
      console.error('[apiClient] Data do erro:', error.response.data);
      console.error('[apiClient] Status do erro:', error.response.status);
      console.error('[apiClient] Headers do erro:', error.response.headers);

      if (error.response.status === 401) {
        // Exemplo: Lidar com erro de Não Autorizado (token inválido/expirado)
        console.warn('[apiClient] Erro 401 - Não autorizado. Deslogando ou tentando refresh token...');
        // TODO: Implementar lógica de logout ou refresh token
        // Exemplo: logoutUser(); router.replace('/login');
      } else if (error.response.status === 403) {
        // Exemplo: Lidar com erro de Proibido (permissões insuficientes)
         console.warn('[apiClient] Erro 403 - Acesso proibido.');
         // TODO: Mostrar mensagem ao utilizador
      }
      // Você pode querer lançar um erro mais específico ou formatado aqui
      // throw new ApiError(error.response.data?.message || error.message, error.response.status);

    } else if (error.request) {
      // A requisição foi feita mas nenhuma resposta foi recebida
      // `error.request` é uma instância de XMLHttpRequest no navegador e http.ClientRequest no node.js
      console.error('[apiClient] Nenhuma resposta recebida:', error.request);
       // TODO: Mostrar mensagem de erro de rede/servidor indisponível
    } else {
      // Algo aconteceu na configuração da requisição que disparou um Erro
      console.error('[apiClient] Erro na configuração da requisição:', error.message);
    }

    // Retorna a promessa rejeitada para que a chamada original possa tratar o erro
    return Promise.reject(error);
  }
);

export default apiClient;

// Exemplo de como obter o token (substitua pela sua lógica real)
import AsyncStorage from '@react-native-async-storage/async-storage'; // Exemplo
const getAuthToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem('userToken');
}
