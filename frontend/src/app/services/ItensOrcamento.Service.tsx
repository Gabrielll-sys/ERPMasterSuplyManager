import { fetcher, poster, putter, deleter } from "../lib/api";
import { url } from "../api/webApiUrl";
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
  return fetcher<IItemOrcamento[]>(`${url}/ItensOrcamento/GetAllMateriaisOrcamento/${orcamentoId}`);
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

  return poster(`${url}/ItensOrcamento/CreateItemOrcamento`, itemParaApi);
};

/**
 * Atualiza um item existente no orçamento.
 * @param payload - Contém o objeto do item e a nova quantidade.
 * @returns Uma promessa com a resposta do Axios.
 */
export const updateItemOrcamento = ({ item, novaQuantidade }: UpdateItemPayload) => {
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

  return putter(`${url}/ItensOrcamento/${item.id}`, payloadParaApi);
};

/**
 * Remove um item de um orçamento.
 * @param itemId - O ID do item a ser removido.
 * @returns Uma promessa com a resposta do Axios.
 */
export const deleteItemOrcamento = (itemId: DeleteItemPayload) => {
  return deleter(`${url}/ItensOrcamento/${itemId}`);
};