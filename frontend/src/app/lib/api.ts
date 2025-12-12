import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

/**
 * Instância centralizada do Axios com interceptors para:
 * - Autenticação automática
 * - Error handling global
 * - Logging e monitoramento
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API,
  timeout: 10000,
});

// Interceptor: Adiciona token de autenticação automaticamente
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Interceptor: Error handling global com toast notifications
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Erro ao processar requisição';
    toast.error(message);

    // Redirecionar para login se não autorizado
    if (error.response?.status === 401) {
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

/**
 * Helper genérico para requisições GET
 * @example
 * const materials = await fetcher<IMaterial[]>('/Materiais');
 */
export async function fetcher<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await api.get<T>(url, config);
  return data;
}

/**
 * Helper genérico para requisições POST
 * @example
 * const newMaterial = await poster<IMaterial, CreateMaterialDTO>('/Materiais', materialData);
 */
export async function poster<T, D = unknown>(url: string, payload: D, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await api.post<T>(url, payload, config);
  return data;
}

/**
 * Helper genérico para requisições PUT
 */
export async function putter<T, D = unknown>(url: string, payload: D, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await api.put<T>(url, payload, config);
  return data;
}

/**
 * Helper genérico para requisições DELETE
 */
export async function deleter<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await api.delete<T>(url, config);
  return data;
}

export default api;
