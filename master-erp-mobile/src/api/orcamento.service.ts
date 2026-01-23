import api from './client';
import { IOrcamento } from '../types';

export const orcamentoService = {
    /**
     * Busca todos os orçamentos
     */
    getAll: async (): Promise<IOrcamento[]> => {
        const response = await api.get<IOrcamento[]>('/Orcamentos');
        return response.data;
    },

    /**
     * Busca orçamento por ID
     */
    getById: async (id: number): Promise<IOrcamento> => {
        const response = await api.get<IOrcamento>(`/Orcamentos/${id}`);
        return response.data;
    },

    /**
     * Busca clientes por nome (autocomplete)
     */
    buscaNomeCliente: async (cliente: string): Promise<IOrcamento[]> => {
        const response = await api.get<IOrcamento[]>(
            `/Orcamentos/buscaNomeCliente?cliente=${encodeURIComponent(cliente)}`
        );
        return response.data;
    },

    /**
     * Cria um novo orçamento
     */
    create: async (model: IOrcamento): Promise<IOrcamento> => {
        const response = await api.post<IOrcamento>('/Orcamentos', model);
        return response.data;
    },

    /**
     * Atualiza um orçamento
     */
    update: async (model: IOrcamento): Promise<void> => {
        if (!model.id) {
            throw new Error('ID do orçamento é obrigatório para atualizar.');
        }
        await api.put(`/Orcamentos/${model.id}`, model);
    },

    /**
     * Autoriza (finaliza) orçamento e dá baixa no estoque
     */
    authorize: async (model: IOrcamento): Promise<void> => {
        if (!model.id) {
            throw new Error('ID do orçamento é obrigatório para autorizar.');
        }
        await api.put(`/Orcamentos/sellUpdate/${model.id}`, model);
    },
};
