import axios from "axios";
import { url } from "../api/webApiUrl";
import { authHeader } from "../_helpers/auth_headers";
import { IItemOrcamento } from "../interfaces/IItemOrcamento";

// --- PAYLOAD TYPES ---
// Define a "forma" dos dados que cada função espera receber.

// Payload para criar um novo item.
type CreateItemPayload = {
  orcamentoId: number;
  materialId: number;
  quantidadeMaterial: number;
  responsavelAdicao: string;
};

// Payload para atualizar um item existente.
type UpdateItemPayload = {
  item: IItemOrcamento; // Passamos o objeto inteiro do item para ter todo o contexto.
  novaQuantidade: number;
};

// Payload para deletar um item (apenas o ID é necessário).
type DeleteItemPayload = number;


// --- SERVICE FUNCTIONS ---

/**
 * Busca todos os materiais de um orçamento específico.
 * @param orcamentoId - O ID do orçamento.
 * @returns Uma promessa que resolve para um array de IItemOrcamento.
 */
export const getMateriaisByOrcamentoId = async (orcamentoId: number): Promise<IItemOrcamento[]> => {
  const { data } = await axios.get(`${url}/ItensOrcamento/GetAllMateriaisOrcamento/${orcamentoId}`, { 
    headers: authHeader() 
  });
  return data;
};

/**
 * Adiciona um novo material a um orçamento.
 * @param payload - Os dados do novo item a ser criado.
 * @returns Uma promessa com a resposta do Axios.
 */
export const createItemOrcamento = (payload: CreateItemPayload) => {
  // Monta o objeto exatamente como a API espera, com base no seu código original.
  const itemParaApi = {
    orcamentoId: payload.orcamentoId,
    materialId: payload.materialId,
    quantidadeMaterial: payload.quantidadeMaterial,
    responsavelAdicao: payload.responsavelAdicao,
    material: {},
    orcamento: {},
    precoItemOrcamento: null,
  };

  console.log("Enviando para API [CreateItem]:", itemParaApi); // Log para depuração

  return axios.post(`${url}/ItensOrcamento/CreateItemOrcamento`, itemParaApi, { 
    headers: authHeader() 
  });
};

/**
 * Atualiza um item existente no orçamento.
 * @param payload - Contém o objeto do item e a nova quantidade.
 * @returns Uma promessa com a resposta do Axios.
 */
export const updateItemOrcamento = ({ item, novaQuantidade }: UpdateItemPayload) => {
  console.log(item)

  // Esta foi a correção principal para o erro 400.
  const payloadParaApi = {
    id: item.id,
    materialId: item.materialId,
    orcamentoId: item.orcamentoId,
    quantidadeMaterial: novaQuantidade,
    precoItemOrcamento: !(typeof(item.precoVenda) === 'undefined') && item.precoVenda > 0 ? item.precoVenda : item.material?.precoVenda,
    material: {},
    orcamento: {},
  };

  console.log(`Enviando para API [UpdateItem] (ID: ${item.id}):`, payloadParaApi); // Log para depuração
  
  return axios.put(`${url}/ItensOrcamento/${item.id}`, payloadParaApi, { 
    headers: authHeader() 
  });
};

/**
 * Remove um item de um orçamento.
 * @param itemId - O ID do item a ser removido.
 * @returns Uma promessa com a resposta do Axios.
 */
export const deleteItemOrcamento = (itemId: DeleteItemPayload) => {
  console.log(`Enviando para API [DeleteItem]: ID ${itemId}`); // Log para depuração

  return axios.delete(`${url}/ItensOrcamento/${itemId}`, { 
    headers: authHeader() 
  });
};