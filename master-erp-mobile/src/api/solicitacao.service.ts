import api from './client';
import {
    ISolicitacaoServico,
    CreateSolicitacaoPayload,
    ConcluirSolicitacaoPayload,
} from '../types';

export const solicitacaoService = {
    /**
     * Busca todas as solicitações
     */
    getAll: async (): Promise<ISolicitacaoServico[]> => {
        const response = await api.get<ISolicitacaoServico[]>('/SolicitacaoServico');
        return response.data;
    },

    /**
     * Busca uma solicitação por ID
     */
    getById: async (id: number): Promise<ISolicitacaoServico> => {
        const response = await api.get<ISolicitacaoServico>(`/SolicitacaoServico/${id}`);
        return response.data;
    },

    /**
     * Cria uma nova solicitação
     */
    create: async (payload: CreateSolicitacaoPayload): Promise<ISolicitacaoServico> => {
        const response = await api.post<ISolicitacaoServico>('/SolicitacaoServico', payload);
        return response.data;
    },

    /**
     * Aceita uma solicitação (registra usuário logado automaticamente)
     */
    aceitar: async (id: number): Promise<ISolicitacaoServico> => {
        const response = await api.put<ISolicitacaoServico>(`/SolicitacaoServico/aceitar/${id}`);
        return response.data;
    },

    /**
     * Conclui uma solicitação (com lista de usuários responsáveis)
     */
    concluir: async (id: number, payload: ConcluirSolicitacaoPayload): Promise<ISolicitacaoServico> => {
        const response = await api.put<ISolicitacaoServico>(`/SolicitacaoServico/concluir/${id}`, payload);
        return response.data;
    },

    /**
     * Atualiza uma solicitação
     */
    update: async (id: number, data: Partial<ISolicitacaoServico>): Promise<ISolicitacaoServico> => {
        const response = await api.put<ISolicitacaoServico>(`/SolicitacaoServico/${id}`, data);
        return response.data;
    },

    /**
     * Exclui uma solicitação
     */
    delete: async (id: number): Promise<void> => {
        await api.delete(`/SolicitacaoServico/${id}`);
    },
};
