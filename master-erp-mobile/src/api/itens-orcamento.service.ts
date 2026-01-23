import api from './client';
import { IItemOrcamento } from '../types';

type CreateItemPayload = {
    orcamentoId: number;
    materialId: number;
    quantidadeMaterial: number;
    responsavelAdicao: string;
};

type UpdateItemPayload = {
    item: IItemOrcamento;
    novaQuantidade: number;
};

export const itensOrcamentoService = {
    /**
     * Busca materiais do orçamento
     */
    getMateriaisByOrcamentoId: async (orcamentoId: number): Promise<IItemOrcamento[]> => {
        const response = await api.get<IItemOrcamento[]>(
            `/ItensOrcamento/GetAllMateriaisOrcamento/${orcamentoId}`
        );
        return response.data;
    },

    /**
     * Adiciona material ao orçamento
     */
    createItemOrcamento: async (payload: CreateItemPayload): Promise<IItemOrcamento> => {
        const itemParaApi = {
            orcamentoId: payload.orcamentoId,
            materialId: payload.materialId,
            quantidadeMaterial: payload.quantidadeMaterial,
            responsavelAdicao: payload.responsavelAdicao,
            material: {},
            orcamento: {},
            precoItemOrcamento: null,
        };
        const response = await api.post<IItemOrcamento>('/ItensOrcamento/CreateItemOrcamento', itemParaApi);
        return response.data;
    },

    /**
     * Atualiza quantidade do item do orçamento
     */
    updateItemOrcamento: async ({ item, novaQuantidade }: UpdateItemPayload): Promise<IItemOrcamento> => {
        const payloadParaApi = {
            id: item.id,
            materialId: item.materialId,
            orcamentoId: item.orcamentoId,
            quantidadeMaterial: novaQuantidade,
            precoItemOrcamento:
                typeof item.precoVenda !== 'undefined' && item.precoVenda > 0
                    ? item.precoVenda
                    : item.material?.precoVenda,
            material: {},
            orcamento: {},
        };
        const response = await api.put<IItemOrcamento>(`/ItensOrcamento/${item.id}`, payloadParaApi);
        return response.data;
    },

    /**
     * Remove item do orçamento
     */
    deleteItemOrcamento: async (itemId: number): Promise<void> => {
        await api.delete(`/ItensOrcamento/${itemId}`);
    },
};
