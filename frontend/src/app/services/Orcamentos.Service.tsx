import { fetcher, poster, putter } from "../lib/api";
import { url } from "../api/webApiUrl";
import { IOrcamento } from "../interfaces/IOrcamento";

export const getOrcamentoById = async (id: number) => {
  return fetcher<IOrcamento>(`${url}/Orcamentos/${id}`);
}

export const getAllOrcamentos = async () => {
  return fetcher<IOrcamento[]>(`${url}/Orcamentos`);
}

export const createOrcamento = async (model: IOrcamento) => {
  return poster<IOrcamento>(`${url}/Orcamentos`, model);
}

export const updateOrcamento = async (model: IOrcamento) => {
  return putter<IOrcamento>(`${url}/Orcamentos/${model.id}`, model);
}

