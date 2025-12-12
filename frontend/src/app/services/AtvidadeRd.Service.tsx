import { fetcher, poster, putter, deleter } from "../lib/api";
import { url } from "../api/webApiUrl";
import { IAtividadeRd } from "../interfaces/IAtividadeRd";

export const getAllAtivdadesInRd = async (
  id: number | undefined
): Promise<IAtividadeRd[]> => {
  return fetcher<IAtividadeRd[]>(`${url}/AtividadesRd/AtividadesInRd/${id}`);
};

export const createAtividadeRd = async (model: IAtividadeRd) => {
  return poster<IAtividadeRd>(`${url}/AtividadesRd`, model);
};

export const updateAtividadeRd = async (model: IAtividadeRd) => {
  const AtividadeRd = {
    id: model.id,
    relatorioRdId: model.relatorioRdId,
    descricao: model.descricao,
    numeroAtividade: model.numeroAtividade,
    status: model.status,
    observacoes: model.observacoes,
    relatorioDiario: {},
  };

  await putter(`${url}/AtividadesRd/${model.id}`, AtividadeRd);
  return 200; // Sucesso
};

export const deleteAtividadeRd = async (id: number) => {
  await deleter(`${url}/AtividadesRd/${id}`);
  return 200; // Sucesso
};
