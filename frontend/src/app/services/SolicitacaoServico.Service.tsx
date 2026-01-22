// app/services/SolicitacaoServico.Service.tsx

import { fetcher, poster, putter, deleter } from "../lib/api";
import { url } from "../api/webApiUrl";
import { 
  ISolicitacaoServico, 
  CreateSolicitacaoPayload, 
  ConcluirSolicitacaoPayload 
} from "../interfaces/ISolicitacaoServico";

// --- Funções de Serviço para Solicitação de Serviço ---

/**
 * Busca todas as solicitações de serviço
 * @returns Lista de solicitações ordenadas por data (mais recentes primeiro)
 */
export const getAllSolicitacoes = async (): Promise<ISolicitacaoServico[]> => {
  return fetcher<ISolicitacaoServico[]>(`${url}/SolicitacaoServico`);
};

/**
 * Busca uma solicitação de serviço pelo ID
 * @param id - ID da solicitação
 * @returns Solicitação encontrada
 */
export const getSolicitacaoById = async (id: number): Promise<ISolicitacaoServico> => {
  return fetcher<ISolicitacaoServico>(`${url}/SolicitacaoServico/${id}`);
};

/**
 * Cria uma nova solicitação de serviço
 * @param payload - Dados da nova solicitação (descrição e nome do cliente)
 * @returns Solicitação criada
 */
export const createSolicitacao = async (payload: CreateSolicitacaoPayload): Promise<ISolicitacaoServico> => {
  return poster<ISolicitacaoServico>(`${url}/SolicitacaoServico`, payload);
};

/**
 * Aceita uma solicitação de serviço (registra o usuário logado automaticamente)
 * @param id - ID da solicitação
 * @returns Solicitação aceita
 */
export const aceitarSolicitacao = async (id: number): Promise<ISolicitacaoServico> => {
  return putter<ISolicitacaoServico>(`${url}/SolicitacaoServico/aceitar/${id}`, {});
};

/**
 * Conclui uma solicitação de serviço
 * @param id - ID da solicitação
 * @param usuarios - Lista de nomes dos usuários responsáveis pela conclusão
 * @returns Solicitação concluída
 */
export const concluirSolicitacao = async (
  id: number, 
  usuarios: string[]
): Promise<ISolicitacaoServico> => {
  const payload: ConcluirSolicitacaoPayload = { usuarios };
  return putter<ISolicitacaoServico>(`${url}/SolicitacaoServico/concluir/${id}`, payload);
};

/**
 * Atualiza uma solicitação de serviço
 * @param id - ID da solicitação
 * @param payload - Dados atualizados
 * @returns Solicitação atualizada
 */
export const updateSolicitacao = async (
  id: number, 
  payload: Partial<ISolicitacaoServico>
): Promise<ISolicitacaoServico> => {
  return putter<ISolicitacaoServico>(`${url}/SolicitacaoServico/${id}`, { ...payload, id });
};

/**
 * Remove uma solicitação de serviço
 * @param id - ID da solicitação
 */
export const deleteSolicitacao = async (id: number): Promise<void> => {
  await deleter(`${url}/SolicitacaoServico/${id}`);
};
