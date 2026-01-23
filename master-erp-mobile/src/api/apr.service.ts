import api from './client';
import { IApr } from '../types';

// ServiÃ§o de API para CRUD de APR
export const aprService = {
    /**
     * Busca todas as APRs
     */
    getAll: async (): Promise<IApr[]> => {
        const response = await api.get<IApr[]>('/Aprs');
        return response.data;
    },

    /**
     * Busca uma APR por ID
     */
    getById: async (id: number): Promise<IApr> => {
        const response = await api.get<IApr>(`/Aprs/${id}`);
        return response.data;
    },

    /**
     * Cria uma nova APR
     */
    create: async (payload: IApr): Promise<IApr> => {
        const response = await api.post<IApr>('/Aprs', payload);
        return response.data;
    },

    /**
     * Atualiza uma APR existente
     */
    update: async (payload: IApr): Promise<IApr> => {
        if (!payload.id) {
            throw new Error('ID da APR Ã© obrigatÃ³rio para atualizar.');
        }
        const response = await api.put<IApr>(`/Aprs/${payload.id}`, payload);
        return response.data;
    },

    /**
     * Exclui uma APR
     */
    delete: async (id: number): Promise<void> => {
        await api.delete(`/Aprs/${id}`);
    },
};
