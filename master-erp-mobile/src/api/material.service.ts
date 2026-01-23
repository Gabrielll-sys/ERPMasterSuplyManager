import api from './client';
import { IInventario } from '../types';

export const materialService = {
    /**
     * Busca materiais por descrição no inventário
     */
    searchByDescription: async (descricao: string): Promise<IInventario[]> => {
        if (!descricao.trim()) return [];
        const cleaned = descricao.split('#').join('.');
        const response = await api.get<IInventario[]>(
            `/Inventarios/buscaDescricaoInventario?descricao=${encodeURIComponent(cleaned)}`
        );
        return response.data;
    },
};
