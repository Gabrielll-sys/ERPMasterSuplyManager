// app/services/OrdemServico.Services.tsx

import axios from "axios";
import { url } from "../api/webApiUrl";
import { authHeader } from "../_helpers/auth_headers";
import { IOrderServico } from "../interfaces/IOrdemServico";
import { IItem } from "../interfaces/IItem";

// --- Tipos de Payload para clareza e segurança ---

type UpdateOsDetailsPayload = Pick<
  IOrderServico, 
  'numeroOs' | 'descricao' | 'responsaveisExecucao' | 'observacoes'
>;

type AuthorizeOsPayload = {
  responsavelAutorizacao: string;
  precoVendaTotalOs: string;
  precoCustoTotalOs: string;
};

type CreateItemOsPayload = {
  ordemServicoId: number;
  materialId: number;
  quantidade: number;
  responsavelAdicao: string;
};

// --- Funções de Serviço para Ordem de Serviço (OS) ---

/**
 * Busca os detalhes de uma Ordem de Serviço específica pelo seu ID.
 * @param osId - O ID da Ordem de Serviço.
 * @returns Uma promessa que resolve para o objeto da OS.
 */
export const getOsById = async (osId: number): Promise<IOrderServico> => {
  const { data } = await axios.get(`${url}/OrdemServicos/${osId}`, { headers: authHeader() });
  return data;
};

/**
 * Atualiza os detalhes principais de uma Ordem de Serviço.
 * @param osId - O ID da OS a ser atualizada.
 * @param payload - Os dados a serem atualizados (numeroOs, descricao, etc.).
 * @returns Uma promessa que resolve para a OS atualizada.
 */
export const updateOsDetails = async (osId: number, payload: UpdateOsDetailsPayload): Promise<IOrderServico> => {
  const { data } = await axios.put(`${url}/OrdemServicos/${osId}`, payload, { headers: authHeader() });
  return data;
};

/**
 * Autoriza e finaliza uma Ordem de Serviço, registrando os totais e o responsável.
 * @param osId - O ID da OS a ser autorizada.
 * @param payload - Os dados da autorização.
 * @returns Uma promessa que resolve para a OS autorizada.
 */
export const authorizeOs = async (osId: number, payload: AuthorizeOsPayload): Promise<IOrderServico> => {
  const { data } = await axios.put(`${url}/OrdemServicos/updateAuthorize/${osId}`, payload, { headers: authHeader() });
  return data;
};

// --- Funções de Serviço para Itens da Ordem de Serviço ---

/**
 * Busca todos os materiais (itens) associados a uma Ordem de Serviço.
 * @param osId - O ID da Ordem de Serviço.
 * @returns Uma promessa que resolve para um array de Itens da OS.
 */
export const getMateriaisOs = async (osId: number): Promise<IItem[]> => {
  const { data } = await axios.get(`${url}/Itens/GetAllMateriaisOs/${osId}`, { headers: authHeader() });
  return data;
};

/**
 * Cria um novo item (adiciona um material) a uma Ordem de Serviço.
 * @param payload - Os dados do novo item.
 * @returns Uma promessa que resolve para o item criado.
 */
export const createItemOs = async (payload: CreateItemOsPayload): Promise<IItem> => {
  // O payload da API espera objetos vazios para as entidades relacionadas
  const apiPayload = { ...payload, material: null, ordemServico: null };
  const { data } = await axios.post(`${url}/Itens/CreateItem`, apiPayload, { headers: authHeader() });
  return data;
};

/**
 * Atualiza um item existente em uma OS (normalmente a quantidade).
 * @param payload - Um objeto contendo o ID do item e a nova quantidade.
 * @returns Uma promessa que resolve para o item atualizado.
 */
export const updateItemOs = async (payload: { itemId: number; quantidade: number; [key: string]: any }): Promise<IItem> => {
  // A API espera o payload completo do item, então montamos ele aqui.
  // Isso pode ser simplificado no backend no futuro para aceitar apenas a quantidade.
  const itemPayload = {
    id: payload.itemId,
    quantidade: payload.quantidade,
    materialId: payload.materialId, // Assumindo que você tem acesso a esses dados no componente
    ordemServicoId: payload.ordemServicoId,
    responsavelMudanca: payload.responsavelMudanca,
    // Preencha outros campos necessários pela sua API
  };
  const { data } = await axios.put(`${url}/Itens/${payload.itemId}`, itemPayload, { headers: authHeader() });
  return data;
};

/**
 * Deleta um item de uma Ordem de Serviço.
 * @param itemId - O ID do item a ser deletado.
 * @returns Uma promessa que resolve quando a operação é concluída.
 */
export const deleteItemOs = async (itemId: number): Promise<void> => {
  await axios.delete(`${url}/Itens/${itemId}`, { headers: authHeader() });
};